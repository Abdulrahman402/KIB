import { ApiProperty } from '@nestjs/swagger';

export class GenreResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({ description: 'TMDB genre ID', example: 28 })
  tmdb_id: number;

  @ApiProperty({ description: 'Genre name', example: 'Action' })
  name: string;

  @ApiProperty({ description: 'Genre creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Genre last update timestamp' })
  updated_at: Date;
}
