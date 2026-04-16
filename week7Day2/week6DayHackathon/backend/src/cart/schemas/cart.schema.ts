import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentType } from '../../common/enums/payment-type.enum';

// ─── Embedded cart item ───────────────────────────────────────────────────────
@Schema({ _id: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop() image: string;
  @Prop({ required: true }) price: number;
  @Prop({ default: 0 }) pointsPrice: number;
  @Prop({ type: String, enum: PaymentType, default: PaymentType.Money })
  paymentType: PaymentType;
  @Prop() size: string;
  @Prop() color: string;
  @Prop({ required: true, min: 1 }) quantity: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// ─── Cart document ────────────────────────────────────────────────────────────
export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] }) items: CartItem[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);
