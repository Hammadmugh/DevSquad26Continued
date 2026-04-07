import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  /* Client joins auction room to receive live bid updates */
  @SubscribeMessage('join:auction')
  handleJoinAuction(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`auction:${auctionId}`);
    return { event: 'joined', auctionId };
  }

  /* Client joins personal room for outbid notifications */
  @SubscribeMessage('join:user')
  handleJoinUser(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`user:${userId}`);
    return { event: 'joined', userId };
  }

  /* ── Emit helpers called by AuctionsService ─────────── */
  emitAuctionStarted(auctionId: string, carName: string) {
    this.server.emit('auction:started', { auctionId, carName });
  }

  emitNewBid(auctionId: string, payload: unknown) {
    this.server.to(`auction:${auctionId}`).emit('bid:new', payload);
    this.server.emit('bid:new:broadcast', payload);
  }

  emitOutbid(userId: string, carName: string, newAmount: number) {
    this.server.to(`user:${userId}`).emit('bid:outbid', { carName, newAmount });
    void this.notificationsService.create(
      userId,
      'outbid',
      `You were outbid on "${carName}". New top bid: $${newAmount.toLocaleString()}`,
      { carName, newAmount },
    );
  }

  emitBidWinner(auctionId: string, winnerId: string, winnerName: string, carName: string, amount: number) {
    this.server.to(`user:${winnerId}`).emit('bid:winner', { auctionId, winnerId, carName, amount });
    this.server.emit('auction:winner:broadcast', { auctionId, carName, winnerName, amount });
    void this.notificationsService.create(
      winnerId,
      'winner',
      `You won "${carName}" with a bid of $${amount.toLocaleString()}!`,
      { auctionId, carName, amount },
    );
  }

  emitAuctionEnded(auctionId: string, carName: string, sellerId?: string) {
    this.server.to(`auction:${auctionId}`).emit('auction:ended', { auctionId, carName });
    this.server.emit('auction:ended:broadcast', { auctionId, carName });
    if (sellerId) {
      void this.notificationsService.create(
        sellerId,
        'ended',
        `Your auction for "${carName}" has ended.`,
        { auctionId, carName },
      );
    }
  }

  emitPaymentStatus(auctionId: string, status: string, winnerId?: string) {
    this.server.to(`auction:${auctionId}`).emit('payment:status', { auctionId, status });
    if (winnerId) {
      const messages: Record<string, string> = {
        ready_for_shipping: 'Your payment was received. Your car is being prepared for shipping.',
        in_transit: 'Your car is now in transit!',
        delivered: 'Your car has been delivered. Please confirm receipt.',
        completed: 'Auction completed. Enjoy your new car!',
      };
      const message = messages[status];
      if (message) {
        void this.notificationsService.create(winnerId, 'payment', message, { auctionId, status });
      }
    }
  }
}
