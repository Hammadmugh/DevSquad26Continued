import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follower } from './entities/follower.entity';
import { User } from '../user/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/dto/create-notification.dto';
import { ChatGateway } from '../websocket-gateway/chat.gateway';

@Injectable()
export class FollowersService {
  constructor(
    @InjectModel('Follower') private followerModel: Model<Follower>,
    @InjectModel('User') private userModel: Model<User>,
    private notificationService: NotificationService,
    private chatGateway: ChatGateway,
  ) {}

  async follow(userId: string, followerId: string) {
    if (userId === followerId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const userObjectId = new Types.ObjectId(userId);
    const followerObjectId = new Types.ObjectId(followerId);

    const existingFollow = await this.followerModel.findOne({
      follower: followerObjectId,
      following: userObjectId,
    });

    if (existingFollow) {
      throw new BadRequestException('Already following');
    }

    // Create follower relationship
    await this.followerModel.create({
      follower: followerObjectId,
      following: userObjectId,
    });

    // Update follower counts
    await this.userModel.findByIdAndUpdate(
      userObjectId,
      {
        $push: { followers: followerObjectId },
        $inc: { followerCount: 1 },
      },
      { new: true },
    );

    await this.userModel.findByIdAndUpdate(
      followerId,
      {
        $push: { following: userObjectId },
        $inc: { followingCount: 1 },
      },
      { new: true },
    );

    // Fetch follower and followed user info for notification
    const followerUser = await this.userModel.findById(followerId);
    const followedUser = await this.userModel.findById(userId);

    // Send notification
    const notification = await this.notificationService.create({
      recipient: userObjectId,
      sender: followerObjectId,
      type: NotificationType.FOLLOW,
      message: `${followerUser?.username} started following ${followedUser?.username}`,
    });

    // Broadcast notification to all users
    this.chatGateway.broadcastNotification(notification);

    return { message: 'Following' };
  }

  async unfollow(userId: string, followerId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const followerObjectId = new Types.ObjectId(followerId);

    await this.followerModel.findOneAndDelete({
      follower: followerObjectId,
      following: userObjectId,
    });

    // Update follower counts
    await this.userModel.findByIdAndUpdate(userObjectId, {
      $pull: { followers: followerObjectId },
      $inc: { followerCount: -1 },
    });

    await this.userModel.findByIdAndUpdate(followerId, {
      $pull: { following: userObjectId },
      $inc: { followingCount: -1 },
    });

    return { message: 'Unfollowed' };
  }

  async getFollowers(userId: string) {
    return this.userModel
      .findById(userId)
      .populate('followers', 'username profilePicture email');
  }

  async getFollowing(userId: string) {
    return this.userModel
      .findById(userId)
      .populate('following', 'username profilePicture email');
  }

  async isFollowing(userId: string, targetId: string) {
    const follow = await this.followerModel.findOne({
      follower: new Types.ObjectId(userId),
      following: new Types.ObjectId(targetId),
    });

    return !!follow;
  }
}
