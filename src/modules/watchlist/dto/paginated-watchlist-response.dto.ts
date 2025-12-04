import { ApiProperty } from '@nestjs/swagger';
import { WatchlistResponseDto } from './watchlist-response.dto';

class WatchlistPaginationMeta {
  @ApiProperty({ description: 'Total number of watchlist items', example: 50 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 3 })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevPage: boolean;
}

export class PaginatedWatchlistResponseDto {
  @ApiProperty({
    type: [WatchlistResponseDto],
    description: 'Array of watchlist items',
  })
  data: WatchlistResponseDto[];

  @ApiProperty({
    type: WatchlistPaginationMeta,
    description: 'Pagination metadata',
  })
  meta: WatchlistPaginationMeta;
}
