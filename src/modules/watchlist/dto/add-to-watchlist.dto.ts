import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToWatchlistDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the movie to add to watchlist',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  movie_id: string;

  @ApiPropertyOptional({
    description: 'Mark movie as favorite',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_favorite?: boolean;
}
