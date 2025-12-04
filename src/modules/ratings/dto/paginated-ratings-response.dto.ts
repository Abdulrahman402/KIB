import { RatingResponseDto } from './rating-response.dto';

export class PaginatedRatingsResponseDto {
  data: RatingResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
