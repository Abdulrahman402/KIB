import { MovieResponseDto } from './movie-response.dto';

export class PaginatedMoviesResponseDto {
  data: MovieResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
