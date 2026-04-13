import { IsString, IsEnum, IsOptional, IsArray, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
}

export class ShippingAddressDto {
  @IsString() fullName: string;
  @IsString() phone: string;
  @IsString() addressLine1: string;
  @IsString() @IsOptional() addressLine2?: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() postalCode: string;
  @IsString() country: string;
}

export class OrderItemDto {
  @IsString() name: string;
  @IsString() @IsOptional() image?: string;
  @IsNumber() @Min(0) price: number;
  @IsString() @IsOptional() size?: string;
  @IsString() @IsOptional() color?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsString() @IsOptional() productId?: string;
}

export class PlaceOrderDirectDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress?: ShippingAddressDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}
