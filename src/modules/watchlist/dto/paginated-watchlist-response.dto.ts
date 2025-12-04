import { WatchlistResponseDto } from './watchlist-response.dto';

export class PaginatedWatchlistResponseDto {
  data: WatchlistResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
