import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentType } from '../../common/enums/payment-type.enum';

// ─── Embedded shipping address ────────────────────────────────────────────────
@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) addressLine1: string;
  @Prop() addressLine2: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) state: string;
  @Prop({ required: true }) postalCode: string;
  @Prop({ required: true }) country: string;
}
export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

// ─── Embedded order item (snapshot of cart item at checkout time) ─────────────
@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop() image: string;
  @Prop({ required: true }) price: number;
  @Prop({ default: 0 }) pointsPrice: number;
  @Prop({ type: String, enum: PaymentType }) paymentType: PaymentType;
  @Prop() size: string;
  @Prop() color: string;
  @Prop({ required: true }) quantity: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// ─── Order document ───────────────────────────────────────────────────────────
export type OrderDocument = Order & Document;

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  Stripe = 'stripe',
  Points = 'points',
  Free = 'free',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: [OrderItemSchema], default: [] }) items: OrderItem[];

  @Prop({ type: ShippingAddressSchema }) shippingAddress: ShippingAddress;

  @Prop({ default: 0 }) totalMoney: number;
  @Prop({ default: 0 }) totalPointsSpent: number;
  @Prop({ default: 0 }) pointsEarned: number;
  @Prop({ default: 0 }) discount: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.Stripe })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @Prop() stripeSessionId: string;
  @Prop() stripePaymentIntentId: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
