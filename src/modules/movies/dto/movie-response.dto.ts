export class MovieResponseDto {
  id: string;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: Date | null;
  runtime: number;
  popularity: number;
  vote_average: number;
  vote_count: number;
  average_rating: number;
  ratings_count: number;
  original_language: string;
  adult: boolean;
  genres: Array<{
    id: string;
    name: string;
    tmdb_id: number;
  }>;
  created_at: Date;
  updated_at: Date;
}
