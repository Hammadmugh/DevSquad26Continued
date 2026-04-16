import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({
    enum: ['COMMENT', 'REPLY', 'LIKE', 'FOLLOW'],
    required: true,
  })
  type: string;

  @Prop()
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  commentId?: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
