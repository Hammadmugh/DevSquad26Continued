import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  /**
   * Save to DB then broadcast. The payload sent to clients will include
   * `_notifId` (the DB _id), `category`, `title`, `body`, `createdAt`,
   * plus any extra event-specific fields.
   */
  async saveAndBroadcast(
    event: string,
    category: string,
    title: string,
    body: string,
    extra: Record<string, any> = {},
  ) {
    const notif = await this.notificationsService.create(category, title, body);
    this.server.emit(event, {
      _notifId: (notif._id as any).toString(),
      category,
      title,
      body,
      createdAt: (notif as any).createdAt,
      read: false,
      ...extra,
    });
    this.logger.log(`[${event}] ${title}`);
  }

  /** Called by ProductsService when a sale is activated */
  async notifySaleStarted(product: any) {
    await this.saveAndBroadcast(
      'sale_started',
      'sale',
      'Sale Started!',
      `${product.name} is now on sale for $${product.salePrice}`,
      {
        productId: product._id,
        name: product.name,
        salePrice: product.salePrice,
        saleEndsAt: product.saleEndsAt,
      },
    );
  }

  /** Legacy plain broadcast (no DB save) */
  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
