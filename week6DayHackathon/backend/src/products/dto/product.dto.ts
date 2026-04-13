import {
  IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, Min, IsDateString,
} from 'class-validator';
import { PaymentType } from '../../common/enums/payment-type.enum';

export class CreateProductDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsString() category?: string;

  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsNumber() @Min(0) pointsPrice?: number;
  @IsOptional() @IsEnum(PaymentType) paymentType?: PaymentType;

  @IsNumber() @Min(0) stock: number;
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) pointsPrice?: number;
  @IsOptional() @IsEnum(PaymentType) paymentType?: PaymentType;
  @IsOptional() @IsNumber() @Min(0) stock?: number;
  @IsOptional() @IsNumber() @Min(0) rating?: number;
  @IsOptional() @IsNumber() @Min(0) reviewCount?: number;
}

export class StartSaleDto {
  @IsNumber() @Min(0) salePrice: number;
  @IsDateString() saleEndsAt: string;
}
