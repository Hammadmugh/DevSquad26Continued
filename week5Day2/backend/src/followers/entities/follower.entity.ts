import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Follower extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  follower: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  following: Types.ObjectId;

  @Prop()
  createdAt: Date;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
