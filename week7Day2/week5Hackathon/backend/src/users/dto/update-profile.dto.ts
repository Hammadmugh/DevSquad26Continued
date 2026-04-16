import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString() @IsOptional() fullName?: string;
  @IsString() @IsOptional() mobile?: string;
  @IsString() @IsOptional() nationality?: string;
  @IsString() @IsOptional() idType?: string;
  @IsString() @IsOptional() idNumber?: string;
  @IsString() @IsOptional() country?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() address1?: string;
  @IsString() @IsOptional() address2?: string;
  @IsString() @IsOptional() landLine?: string;
  @IsString() @IsOptional() poBox?: string;
}
