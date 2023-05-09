import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Nike Air Max 90',
    nullable: false,
    minLength: 3
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    required: false
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsArray()
  images?: string[];
}
