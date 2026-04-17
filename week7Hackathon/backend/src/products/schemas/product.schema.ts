import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export class RecipeIngredient {
  @Prop({ type: Types.ObjectId, ref: 'RawMaterial', required: true })
  materialId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: [{ materialId: { type: Types.ObjectId, ref: 'RawMaterial' }, quantity: Number }], default: [] })
  recipe: RecipeIngredient[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
