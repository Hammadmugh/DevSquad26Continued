import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true }) name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop() password?: string;

  @Prop({ type: String, enum: Role, default: Role.User }) role: Role;

  @Prop({ default: 0 }) loyaltyPoints: number;

  /** 'local' | 'google' | 'github' | 'discord' */
  @Prop({ default: 'local' }) provider: string;

  /** OAuth provider's user ID */
  @Prop() providerId?: string;

  /** Avatar URL from OAuth provider */
  @Prop() avatar?: string;

  /** Last login timestamp */
  @Prop() lastLoginAt?: Date;

  /** 'local' | 'google' | 'github' | 'discord' */
  @Prop() lastLoginMethod?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Never return password in JSON
UserSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    ret['password'] = undefined;
    return ret;
  },
});
