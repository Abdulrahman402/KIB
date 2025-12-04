import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the rating',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'MongoDB ObjectId of the user who created the rating',
    example: '507f1f77bcf86cd799439012',
  })
  user_id: string;

  @ApiProperty({
    description: 'Movie information',
    example: {
      id: '507f1f77bcf86cd799439011',
      title: 'Inception',
      poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      tmdb_id: 27205,
      release_date: '2010-07-16T00:00:00.000Z',
    },
  })
  movie: {
    id: string;
    title: string;
    poster_path: string;
    tmdb_id: number;
    release_date?: Date;
  };

  @ApiProperty({ description: 'Rating value (1-10)', example: 8 })
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review text',
    example: 'Great movie!',
  })
  review?: string;

  @ApiProperty({ description: 'Rating creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Rating last update timestamp' })
  updated_at: Date;
}
