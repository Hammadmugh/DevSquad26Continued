import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFollowerDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;
}
