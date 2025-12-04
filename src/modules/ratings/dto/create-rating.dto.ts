import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the movie to rate',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  movie_id: string;

  @ApiProperty({
    description: 'Rating value (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review text (maximum 500 characters)',
    example: 'An amazing movie with great plot and cinematography!',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string;
}
