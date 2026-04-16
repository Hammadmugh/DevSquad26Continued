import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsMongoId()
  commentId: Types.ObjectId;
}
