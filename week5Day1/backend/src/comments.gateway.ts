import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommentsService } from './comments.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedClients = new Set<string>();

  constructor(private readonly commentsService: CommentsService) {}

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    console.log(`Client connected: ${client.id}`);

    // Send existing comments to the new client
    const comments = this.commentsService.getComments();
    client.emit('load_comments', comments);

    // Notify all clients about the new connection
    this.emitUserCount();
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);

    // Notify all clients about the disconnection
    this.emitUserCount();
  }

  @SubscribeMessage('add_comment')
  handleAddComment(
    @MessageBody() data: { author: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.author || !data.text) {
      return;
    }

    const comment = this.commentsService.addComment(data.author, data.text);

    // Broadcast the new comment to all connected clients
    client.broadcast.emit('new_comment', comment);

    // Return confirmation to the sender
    client.emit('comment_added', comment);
  }

  private emitUserCount() {
    // This method would broadcast user count to all connected clients
    // We can implement this if needed for the online user count feature
  }
}
