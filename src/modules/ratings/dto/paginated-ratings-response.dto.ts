import { ApiProperty } from '@nestjs/swagger';
import { RatingResponseDto } from './rating-response.dto';

class RatingPaginationMeta {
  @ApiProperty({ description: 'Total number of ratings', example: 150 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Ratings per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevPage: boolean;
}

export class PaginatedRatingsResponseDto {
  @ApiProperty({ type: [RatingResponseDto], description: 'Array of ratings' })
  data: RatingResponseDto[];

  @ApiProperty({
    type: RatingPaginationMeta,
    description: 'Pagination metadata',
  })
  meta: RatingPaginationMeta;
}
