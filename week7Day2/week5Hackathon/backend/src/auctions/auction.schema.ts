import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

export class BidEntry {
  userId: Types.ObjectId;
  amount: number;
  placedAt: Date;
}

@Schema({ timestamps: true })
export class Auction {
  @Prop({ required: true })
  carName: string;

  @Prop({ default: '' })
  carImage: string;

  @Prop({ default: 0 })
  currentBid: number;

  @Prop({ default: 0 })
  startingBid: number;

  @Prop({ default: false })
  trending: boolean;

  @Prop({ default: false })
  isLive: boolean;

  @Prop({ default: false })
  sold: boolean;

  @Prop({ default: 5 })
  rating: number;

  @Prop({ default: '' })
  review: string;

  @Prop()
  endTime: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  seller: Types.ObjectId;

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User' },
        amount: Number,
        placedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  bids: BidEntry[];

  @Prop({ default: '' })
  make: string;

  @Prop({ default: '' })
  model: string;

  @Prop({ default: '' })
  year: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ default: '' })
  style: string;

  @Prop({ default: '' })
  type: string;

  @Prop({ default: 'unpaid' })
  paymentStatus: string; // unpaid | ready_for_shipping | in_transit | delivered | completed

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winnerId: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  soldAt: Date | null;

  @Prop({ default: '' })
  lotNo: string;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
