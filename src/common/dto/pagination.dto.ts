import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

/* eslint-disable prettier/prettier */
export class PaginationDto {

  @ApiProperty({
    description: 'Limit of items per page',
    example: 10,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;
  
  @ApiProperty({
    description: 'Offset of items per page',
    example: 0,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

}
