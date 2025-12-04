import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MovieQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Filter by genre MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  genre?: string; // Genre MongoDB ObjectId

  @ApiPropertyOptional({
    description: 'Filter by release year',
    example: 2024,
    minimum: 1900,
    maximum: 2100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by minimum rating',
    example: 7,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Sort movies by field',
    enum: ['popularity', 'release_date', 'vote_average', 'title'],
    default: 'popularity',
  })
  @IsOptional()
  @IsEnum(['popularity', 'release_date', 'vote_average', 'title'])
  sortBy?: string = 'popularity';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
