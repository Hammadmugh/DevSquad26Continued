import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from './auction.schema';
import { User, UserDocument } from '../users/user.schema';
import { CreateAuctionDto, PlaceBidDto, AuctionQueryDto } from './dto/auction.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(query: AuctionQueryDto) {
    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.make) filter.make = new RegExp(query.make, 'i');
    if (query.model) filter.model = new RegExp(query.model, 'i');
    if (query.year) filter.year = query.year;
    if (query.color) filter.color = new RegExp(query.color, 'i');
    if (query.style) filter.style = new RegExp(query.style, 'i');
    if (query.type) filter.type = new RegExp(query.type, 'i');
    if (query.minPrice || query.maxPrice) {
      filter.currentBid = {};
      if (query.minPrice) (filter.currentBid as Record<string, number>)['$gte'] = parseFloat(query.minPrice);
      if (query.maxPrice) (filter.currentBid as Record<string, number>)['$lte'] = parseFloat(query.maxPrice);
    }

    const [data, total] = await Promise.all([
      this.auctionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.auctionModel.countDocuments(filter),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findLive() {
    return this.auctionModel.find({ isLive: true }).sort({ createdAt: -1 }).limit(8);
  }

  async findOne(id: string) {
    const auction = await this.auctionModel.findById(id).populate('seller', 'fullName email');
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  async create(dto: CreateAuctionDto, sellerId: string) {
    const auction = await this.auctionModel.create({
      ...dto,
      seller: new Types.ObjectId(sellerId),
      currentBid: dto.startingBid ?? 0,
      lotNo: String(Math.floor(100000 + Math.random() * 900000)),
    });
    this.notificationsGateway.emitAuctionStarted(auction._id.toString(), auction.carName);
    return auction;
  }

  async update(id: string, dto: Partial<CreateAuctionDto>, userId: string) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.seller?.toString() !== userId) throw new ForbiddenException();
    return this.auctionModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string, userId: string) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.seller?.toString() !== userId) throw new ForbiddenException();
    await this.auctionModel.findByIdAndDelete(id);
    return { message: 'Auction deleted' };
  }

  async endBid(id: string, userId: string) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.seller?.toString() !== userId) throw new ForbiddenException();
    auction.sold = true;
    auction.soldAt = new Date();
    await auction.save();

    // Determine winner (highest bidder) and notify
    if (auction.bids.length > 0) {
      const winningBid = auction.bids.reduce((max, b) => (b.amount > max.amount ? b : max), auction.bids[0]);
      auction.winnerId = winningBid.userId;
      await auction.save();
      const winner = await this.userModel.findById(winningBid.userId).select('fullName').lean();
      const winnerName = (winner as { fullName?: string } | null)?.fullName ?? 'Unknown';
      this.notificationsGateway.emitBidWinner(
        id,
        winningBid.userId.toString(),
        winnerName,
        auction.carName,
        winningBid.amount,
      );
    }

    this.notificationsGateway.emitAuctionEnded(id, auction.carName, auction.seller?.toString());
    return auction;
  }

  async placeBid(id: string, dto: PlaceBidDto, userId: string) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.seller?.toString() === userId)
      throw new ForbiddenException('Sellers cannot bid on their own auction');

    const uid = new Types.ObjectId(userId);
    auction.bids.push({ userId: uid, amount: dto.amount, placedAt: new Date() });

    if (dto.amount > auction.currentBid) {
      // notify previous leader they've been outbid
      const prevLeader = auction.bids
        .filter((b) => b.userId.toString() !== userId)
        .sort((a, b) => b.amount - a.amount)[0];
      if (prevLeader) {
        this.notificationsGateway.emitOutbid(prevLeader.userId.toString(), auction.carName, dto.amount);
      }
      auction.currentBid = dto.amount;
    }

    await auction.save();

    // broadcast to all viewers
    this.notificationsGateway.emitNewBid(id, {
      userId,
      amount: dto.amount,
      totalBids: auction.bids.length,
      currentBid: auction.currentBid,
    });

    return auction;
  }

  async getBids(id: string) {
    const auction = await this.auctionModel.findById(id).populate('bids.userId', 'fullName');
    if (!auction) throw new NotFoundException('Auction not found');
    return auction.bids;
  }
}
