import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction, AuctionDocument } from '../auctions/auction.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async pay(auctionId: string, userId: string) {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    if (!auction.sold) throw new BadRequestException('Auction has not ended yet');
    if (auction.winnerId?.toString() !== userId)
      throw new ForbiddenException('Only the winner can make payment');
    if (auction.paymentStatus !== 'unpaid')
      throw new BadRequestException('Payment already in progress');

    auction.paymentStatus = 'ready_for_shipping';
    await auction.save();
    this.notificationsGateway.emitPaymentStatus(auctionId, 'ready_for_shipping', userId);

    // Auto-advance through shipping stages every 60 seconds
    this.autoAdvance(auctionId, userId);

    return auction;
  }

  async getStatus(auctionId: string) {
    const auction = await this.auctionModel
      .findById(auctionId)
      .select('paymentStatus winnerId soldAt lotNo carName currentBid endTime carImage startingBid bids sold')
      .lean();
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  private autoAdvance(auctionId: string, winnerId: string) {
    setTimeout(async () => {
      await this.auctionModel.findByIdAndUpdate(auctionId, { paymentStatus: 'in_transit' });
      this.notificationsGateway.emitPaymentStatus(auctionId, 'in_transit', winnerId);

      setTimeout(async () => {
        await this.auctionModel.findByIdAndUpdate(auctionId, { paymentStatus: 'delivered' });
        this.notificationsGateway.emitPaymentStatus(auctionId, 'delivered', winnerId);

        setTimeout(async () => {
          await this.auctionModel.findByIdAndUpdate(auctionId, { paymentStatus: 'completed' });
          this.notificationsGateway.emitPaymentStatus(auctionId, 'completed', winnerId);
        }, 5_000); // 5s after delivered → completed
      }, 60_000); // 60s → in_transit → delivered
    }, 60_000); // 60s → ready_for_shipping → in_transit
  }
}
