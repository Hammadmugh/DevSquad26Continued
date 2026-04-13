import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document & { createdAt: Date };

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: ['review', 'purchase', 'sale', 'general'], default: 'general' })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
