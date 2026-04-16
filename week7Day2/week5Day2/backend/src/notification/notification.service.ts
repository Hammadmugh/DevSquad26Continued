import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationModel.create({
      recipient: createNotificationDto.recipient,
      sender: createNotificationDto.sender,
      type: createNotificationDto.type,
      message: createNotificationDto.message,
      commentId: createNotificationDto.commentId,
      read: false,
    });

    return await notification.populate([
      { path: 'sender', select: 'username profilePicture email' },
      { path: 'recipient', select: 'username email' },
    ]);
  }

  async findAll(userId: string) {
    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate('sender', 'username profilePicture email')
      .sort({ createdAt: -1 });
  }

  async findUnread(userId: string) {
    return this.notificationModel
      .find({
        recipient: new Types.ObjectId(userId),
        read: false,
      })
      .populate('sender', 'username profilePicture email')
      .sort({ createdAt: -1 });
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      read: false,
    });
    return { unreadCount: count };
  }

  async markAsRead(id: string, userId: string) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid notification ID');
    }

    // Check authorization BEFORE database modification
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.recipient.toString() !== userId) {
      throw new NotFoundException('Notification not found');
    }

    // NOW update after verification
    return await this.notificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId) },
      { read: true },
    );
  }

  async delete(id: string, userId: string) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid notification ID');
    }

    // Check authorization BEFORE database modification
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.recipient.toString() !== userId) {
      throw new NotFoundException('Notification not found');
    }

    // NOW delete after verification
    await this.notificationModel.findByIdAndDelete(id);
    return { message: 'Notification deleted' };
  }

  async deleteAll(userId: string) {
    return this.notificationModel.deleteMany({
      recipient: new Types.ObjectId(userId),
    });
  }
}
