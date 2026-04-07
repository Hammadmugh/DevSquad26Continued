import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: '' })
  mobile: string;

  @Prop({ default: '' })
  nationality: string;

  @Prop({ default: '' })
  idType: string;

  @Prop({ default: '' })
  idNumber: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  address1: string;

  @Prop({ default: '' })
  address2: string;

  @Prop({ default: '' })
  landLine: string;

  @Prop({ default: '' })
  poBox: string;

  @Prop({ type: [Types.ObjectId], ref: 'Auction', default: [] })
  wishlist: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
