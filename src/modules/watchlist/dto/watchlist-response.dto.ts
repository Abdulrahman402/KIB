export class WatchlistResponseDto {
  id: string;
  user_id: string;
  movie: {
    id: string;
    title: string;
    poster_path: string;
    tmdb_id: number;
    release_date?: Date;
  };
  is_favorite: boolean;
  added_at: Date;
  created_at: Date;
  updated_at: Date;
}
