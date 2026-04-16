import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PaymentType } from '../../common/enums/payment-type.enum';

export class AddToCartDto {
  @IsString() productId: string;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsNumber() @Min(0) pointsPrice?: number;
  @IsOptional() @IsEnum(PaymentType) paymentType?: PaymentType;
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() color?: string;
  @IsNumber() @Min(1) quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber() @Min(0) quantity: number;
}
