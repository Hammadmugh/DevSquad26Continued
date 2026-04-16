import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Auction, AuctionDocument } from '../auctions/auction.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('fullName email mobile nationality idType');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /* ── Wishlist ─────────────────────────────────────────── */
  async getWishlist(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('wishlist')
      .select('wishlist');
    if (!user) throw new NotFoundException('User not found');
    return user.wishlist;
  }

  async addToWishlist(userId: string, auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: new Types.ObjectId(auctionId) },
    });
    return { message: 'Added to wishlist' };
  }

  async removeFromWishlist(userId: string, auctionId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { wishlist: new Types.ObjectId(auctionId) },
    });
    return { message: 'Removed from wishlist' };
  }

  /* ── My Cars (auctions they listed) ──────────────────── */
  async getMyCars(userId: string) {
    return this.auctionModel.find({ seller: new Types.ObjectId(userId) });
  }

  /* ── My Bids ──────────────────────────────────────────── */
  async getMyBids(userId: string) {
    const auctions = await this.auctionModel.find({
      'bids.userId': new Types.ObjectId(userId),
    });

    return auctions.map((auction) => {
      const myBids = auction.bids.filter(
        (b) => b.userId.toString() === userId,
      );
      const myHighest = Math.max(...myBids.map((b) => b.amount));
      const winningBid = auction.currentBid;
      const bidStatus = myHighest >= winningBid ? 'winning' : 'losing';
      return {
        auctionId: auction._id,
        carName: auction.carName,
        carImage: auction.carImage,
        winningBid,
        yourBid: myHighest,
        bidStatus,
        totalBids: auction.bids.length,
        trending: auction.trending,
        endTime: auction.endTime,
      };
    });
  }
}
