import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './entities/like.entity';
import { Comment } from '../comment/entities/comment.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel('Like') private likeModel: Model<Like>,
    @InjectModel('Comment') private commentModel: Model<Comment>,
  ) {}

  async likeComment(commentId: string, userId: string, createLikeDto: CreateLikeDto) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    const existingLike = await this.likeModel.findOne({
      user: userIdObj,
      comment: new Types.ObjectId(commentId),
    });

    if (existingLike) {
      throw new BadRequestException('Already liked');
    }

    const like = await this.likeModel.create({
      user: userIdObj,
      comment: new Types.ObjectId(commentId),
    });

    // Update comment likes count
    comment.likes = (comment.likes || 0) + 1;
    if (!comment.likedBy) {
      comment.likedBy = [];
    }
    comment.likedBy.push(userIdObj);
    await comment.save();

    return like;
  }

  async unlikeComment(commentId: string, userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const commentIdObj = new Types.ObjectId(commentId);

    const like = await this.likeModel.findOne({
      user: userIdObj,
      comment: commentIdObj,
    });

    if (!like) {
      throw new BadRequestException('Not liked yet');
    }

    await this.likeModel.findByIdAndDelete(like._id);

    // Update comment likes count
    const comment = await this.commentModel.findById(commentId);
    if (comment) {
      comment.likes = Math.max(0, (comment.likes || 1) - 1);
      comment.likedBy = comment.likedBy.filter((id) => !id.equals(userIdObj));
      await comment.save();
    }

    return { message: 'Unliked' };
  }

  async getCommentLikes(commentId: string) {
    return this.likeModel
      .find({ comment: commentId })
      .populate('user', 'username profilePicture');
  }

  async isLiked(commentId: string, userId: string) {
    const like = await this.likeModel.findOne({
      user: new Types.ObjectId(userId),
      comment: new Types.ObjectId(commentId),
    });

    return !!like;
  }
}
