import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || 'http://localhost:3001',
    ],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('ChatGateway');
  private connectedUsers: Map<string, { socketId: string; userId: string }> =
    new Map();

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Server initialized');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
    const token = socket.handshake.auth.token;

    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        const userId = decoded.sub.toString();
        this.connectedUsers.set(userId, {
          socketId: socket.id,
          userId,
        });
        // Emit custom event instead of reserved 'connect' event
        socket.emit('connection:success', { message: 'Connected to server', userId });
        this.server.emit('users:online', Array.from(this.connectedUsers.keys()));
        this.logger.log(
          `User ${userId} connected with socket ${socket.id}`,
        );
      } catch (error) {
        this.logger.error('Invalid token', error);
        socket.disconnect();
      }
    } else {
      this.logger.warn('No token provided, disconnecting');
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
    let userId = '';

    for (const [key, value] of this.connectedUsers.entries()) {
      if (value.socketId === socket.id) {
        userId = key;
        this.connectedUsers.delete(key);
        break;
      }
    }

    if (userId) {
      this.server.emit('users:offline', Array.from(this.connectedUsers.keys()));
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('comment:posted')
  handleCommentPosted(socket: Socket, data: any) {
    this.logger.log(`Comment posted: ${data.commentId}`);
    this.server.emit('comment:posted', data);
  }

  @SubscribeMessage('comment:reply')
  handleReply(socket: Socket, data: any) {
    this.logger.log(`Reply added to comment: ${data.commentId}`);
    const user = this.getUserBySocketId(socket.id);

    if (user) {
      // Notify comment author (only them, not everyone)
      const authorSocketId = this.connectedUsers.get(data.authorId.toString())
        ?.socketId;
      if (authorSocketId) {
        this.server.to(authorSocketId).emit('reply:added', data);
      }
    }

    // Broadcast to all that reply was added
    this.server.emit('comment:updated', {
      commentId: data.commentId,
      repliesCount: data.repliesCount,
    });
  }

  @SubscribeMessage('comment:liked')
  handleCommentLiked(socket: Socket, data: any) {
    this.logger.log(`Comment liked: ${data.commentId}`);
    const user = this.getUserBySocketId(socket.id);

    if (user) {
      // Notify comment author
      const authorSocketId = this.connectedUsers.get(data.authorId.toString())
        ?.socketId;
      if (authorSocketId) {
        this.server.to(authorSocketId).emit('like:received', data);
      }
    }

    // Broadcast update
    this.server.emit('comment:updated', {
      commentId: data.commentId,
      likes: data.likes,
    });
  }

  @SubscribeMessage('user:followed')
  handleUserFollowed(socket: Socket, data: any) {
    this.logger.log(`User followed: ${data.targetUserId}`);
    const user = this.getUserBySocketId(socket.id);

    if (user) {
      // Notify the followed user
      const targetSocketId = this.connectedUsers.get(data.targetUserId)
        ?.socketId;
      if (targetSocketId) {
        this.server.to(targetSocketId).emit('follower:received', {
          followerId: data.followerId,
          followerUsername: data.followerUsername,
          message: `${data.followerUsername} started following you`,
        });
      }
    }
  }

  @SubscribeMessage('notification:viewed')
  handleNotificationViewed(socket: Socket, data: any) {
    const user = this.getUserBySocketId(socket.id);
    if (user) {
      this.logger.log(
        `User ${user.userId} viewed notification: ${data.notificationId}`,
      );
    }
  }

  @SubscribeMessage('user:typing')
  handleUserTyping(socket: Socket, data: any) {
    this.server.emit('user:typing', {
      userId: data.userId,
      commentId: data.commentId,
      isTyping: data.isTyping,
    });
  }

  private getUserBySocketId(socketId: string): any {
    for (const [userId, connection] of this.connectedUsers.entries()) {
      if (connection.socketId === socketId) {
        return { userId, socketId: connection.socketId };
      }
    }
    return null;
  }

  // Helper method to send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    const connection = this.connectedUsers.get(userId);
    this.logger.log(`Attempting to send notification to user ${userId}`, {
      isConnected: !!connection,
      socketId: connection?.socketId,
      notificationId: notification?._id,
      notificationType: notification?.type,
      message: notification?.message,
    });
    if (connection) {
      // Convert MongoDB document to plain object for socket transmission
      const notificationData = notification.toObject ? notification.toObject() : notification;
      this.server.to(connection.socketId).emit('notification:received', notificationData);
      this.logger.log(`✓ Notification sent to user ${userId} on socket ${connection.socketId}`);
    } else {
      this.logger.warn(`✗ User ${userId} is not connected, notification queued or will be missed`);
    }
  }

  // Helper method to broadcast notification to all online users
  broadcastNotification(notification: any) {
    this.server.emit('notification:received', notification);
  }
}