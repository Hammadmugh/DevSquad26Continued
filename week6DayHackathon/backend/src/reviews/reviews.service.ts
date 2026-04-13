import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/review.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
    private usersService: UsersService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    productId: string,
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    // Verify product exists
    await this.productsService.findOne(productId);

    // Get user name
    const user = await this.usersService.findById(userId);

    const review = await this.reviewModel.create({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
      userName: user.name,
      rating: dto.rating,
      comment: dto.comment,
    });

    // Recalculate product average rating
    const stats = await this.reviewModel.aggregate([
      { $match: { productId: new Types.ObjectId(productId) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await this.productsService.update(productId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    // Notify clients via websocket and persist to DB
    await this.notificationsGateway.saveAndBroadcast(
      'new_review',
      'review',
      'New Review Posted',
      `${user.name} left a ${dto.rating}★ review: "${dto.comment.slice(0, 60)}${dto.comment.length > 60 ? '…' : ''}"`,
      { productId, userName: user.name, rating: dto.rating, comment: dto.comment },
    );

    return review;
  }

  async findByProduct(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
