import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({ description: 'TMDB movie ID', example: 27205 })
  tmdb_id: number;

  @ApiProperty({ description: 'Movie title', example: 'Inception' })
  title: string;

  @ApiProperty({
    description: 'Movie overview/description',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology...',
  })
  overview: string;

  @ApiProperty({
    description: 'Poster image path',
    example: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    nullable: true,
  })
  poster_path: string | null;

  @ApiProperty({
    description: 'Backdrop image path',
    example: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    nullable: true,
  })
  backdrop_path: string | null;

  @ApiProperty({
    description: 'Movie release date',
    example: '2010-07-16T00:00:00.000Z',
    nullable: true,
  })
  release_date: Date | null;

  @ApiProperty({ description: 'Movie runtime in minutes', example: 148 })
  runtime: number;

  @ApiProperty({ description: 'Popularity score', example: 82.428 })
  popularity: number;

  @ApiProperty({ description: 'TMDB vote average', example: 8.4 })
  vote_average: number;

  @ApiProperty({ description: 'TMDB vote count', example: 32543 })
  vote_count: number;

  @ApiProperty({
    description: 'Average user rating from our platform',
    example: 8.2,
  })
  average_rating: number;

  @ApiProperty({
    description: 'Number of ratings from our platform',
    example: 150,
  })
  ratings_count: number;

  @ApiProperty({ description: 'Original language code', example: 'en' })
  original_language: string;

  @ApiProperty({ description: 'Adult content flag', example: false })
  adult: boolean;

  @ApiProperty({
    description: 'Array of genres',
    example: [
      { id: '507f1f77bcf86cd799439011', name: 'Action', tmdb_id: 28 },
      { id: '507f1f77bcf86cd799439012', name: 'Sci-Fi', tmdb_id: 878 },
    ],
  })
  genres: Array<{
    id: string;
    name: string;
    tmdb_id: number;
  }>;

  @ApiProperty({ description: 'Record creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updated_at: Date;
}
