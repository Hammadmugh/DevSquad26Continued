import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
  ) {}

  async create(category: string, title: string, body: string): Promise<NotificationDocument> {
    return this.notifModel.create({ category, title, body });
  }

  async findAll(): Promise<NotificationDocument[]> {
    return this.notifModel.find().sort({ createdAt: -1 }).limit(50).exec();
  }

  async markRead(id: string): Promise<void> {
    await this.notifModel.findByIdAndUpdate(id, { read: true });
  }

  async markAllRead(): Promise<void> {
    await this.notifModel.updateMany({ read: false }, { read: true });
  }

  async deleteAll(): Promise<void> {
    await this.notifModel.deleteMany({});
  }
}
