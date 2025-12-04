import { ApiProperty } from '@nestjs/swagger';

export class WatchlistResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the watchlist item',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'MongoDB ObjectId of the user',
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

  @ApiProperty({
    description: 'Whether the movie is marked as favorite',
    example: true,
  })
  is_favorite: boolean;

  @ApiProperty({ description: 'When the movie was added to watchlist' })
  added_at: Date;

  @ApiProperty({ description: 'Watchlist item creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Watchlist item last update timestamp' })
  updated_at: Date;
}
