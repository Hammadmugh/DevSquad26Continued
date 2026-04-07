import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    type: string,
    message: string,
    data: Record<string, unknown> = {},
  ): Promise<NotificationDocument> {
    return this.notificationModel.create({ userId, type, message, data });
  }

  async getForUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean() as unknown as NotificationDocument[];
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ userId, read: false }, { read: true });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId });
  }
}
