import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        productName: String,
        quantity: Number,
        unitPrice: Number,
        subtotal: Number,
      },
    ],
    required: true,
  })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({
    enum: ['completed', 'cancelled'],
    default: 'completed',
  })
  status: string;

  @Prop({ default: '' })
  note: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
