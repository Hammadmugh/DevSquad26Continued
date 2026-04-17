import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['g', 'ml', 'pcs', 'kg', 'l'])
  unit: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minStockLevel?: number;
}
