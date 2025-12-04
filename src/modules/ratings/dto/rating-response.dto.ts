export class RatingResponseDto {
  id: string;
  user_id: string;
  movie: {
    id: string;
    title: string;
    poster_path: string;
    tmdb_id: number;
    release_date?: Date;
  };
  rating: number;
  review?: string;
  created_at: Date;
  updated_at: Date;
}
