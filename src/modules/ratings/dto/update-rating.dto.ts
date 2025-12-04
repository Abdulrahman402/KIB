import {
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiPropertyOptional({
    description: 'Updated rating value (1-10)',
    example: 9,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Updated review text (maximum 500 characters)',
    example: 'On second viewing, this movie is even better!',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string;
}
