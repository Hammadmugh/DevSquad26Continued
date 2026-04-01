import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWebsocketGatewayDto {
  @IsNotEmpty()
  @IsMongoId()
  user: Types.ObjectId;

  @IsNotEmpty()
  socketId: string;
}
