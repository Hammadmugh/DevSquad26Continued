import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentType } from '../../common/enums/payment-type.enum';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true }) description: string;
  @Prop({ type: [String], default: [] }) images: string[];
  @Prop({ type: String }) category: string;

  /** Money price (0 for points-only products) */
  @Prop({ required: true, default: 0 }) price: number;

  /** Loyalty points cost (0 for money-only products) */
  @Prop({ default: 0 }) pointsPrice: number;

  /** How this product can be purchased */
  @Prop({ type: String, enum: PaymentType, default: PaymentType.Money })
  paymentType: PaymentType;

  @Prop({ default: 0 }) stock: number;
  @Prop({ default: 0 }) rating: number;
  @Prop({ default: 0 }) reviewCount: number;

  /** Sale */
  @Prop({ default: false }) onSale: boolean;
  @Prop({ type: Number, default: null }) salePrice: number | null;
  @Prop({ type: Date, default: null }) saleEndsAt: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
