import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WebsocketGateway extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  socketId: string;

  @Prop({ default: true })
  isConnected: boolean;

  @Prop()
  lastActivity: Date;
}

export const WebsocketGatewaySchema = SchemaFactory.createForClass(WebsocketGateway);
