import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsMongoId()
  replyTo?: Types.ObjectId;
}
