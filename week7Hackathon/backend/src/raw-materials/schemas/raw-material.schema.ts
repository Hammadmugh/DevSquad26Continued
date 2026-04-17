import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawMaterialDocument = RawMaterial & Document;

@Schema({ timestamps: true })
export class RawMaterial {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ['g', 'ml', 'pcs', 'kg', 'l'] })
  unit: string;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;

  @Prop({ default: 0, min: 0 })
  minStockLevel: number;
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);
