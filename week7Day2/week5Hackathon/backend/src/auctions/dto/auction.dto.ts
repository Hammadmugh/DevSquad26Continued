import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuctionDto {
  @IsString() carName: string;
  @IsString() @IsOptional() carImage?: string;
  @IsNumber() @IsOptional() startingBid?: number;
  @IsBoolean() @IsOptional() trending?: boolean;
  @IsBoolean() @IsOptional() isLive?: boolean;
  @IsString() @IsOptional() review?: string;
  @IsDateString() @IsOptional() endTime?: string;
  @IsString() @IsOptional() make?: string;
  @IsString() @IsOptional() model?: string;
  @IsString() @IsOptional() year?: string;
  @IsString() @IsOptional() color?: string;
  @IsString() @IsOptional() style?: string;
  @IsString() @IsOptional() type?: string;
}

export class PlaceBidDto {
  @IsNumber()
  @Transform(({ value }: { value: unknown }) => Number(value))
  amount: number;
}

export class AuctionQueryDto {
  @IsString() @IsOptional() make?: string;
  @IsString() @IsOptional() model?: string;
  @IsString() @IsOptional() year?: string;
  @IsString() @IsOptional() color?: string;
  @IsString() @IsOptional() style?: string;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() minPrice?: string;
  @IsString() @IsOptional() maxPrice?: string;
  @IsString() @IsOptional() page?: string;
  @IsString() @IsOptional() limit?: string;
}
