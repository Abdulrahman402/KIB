import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsString()
  movie_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string;
}
