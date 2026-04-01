import { IsNotEmpty, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export enum NotificationType {
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsMongoId()
  recipient: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  sender: Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsMongoId()
  commentId?: Types.ObjectId;
}
