import { Document } from 'mongoose';

export interface IWatchlist {
  user_id: string;
  movie_id: string;
  is_favorite: boolean;
  added_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IWatchlistDocument extends IWatchlist, Document {}

export interface IWatchlistResponse {
  id: string;
  user_id: string;
  movie_id: string;
  is_favorite: boolean;
  added_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IWatchlistWithMovie extends IWatchlistResponse {
  movie: {
    id: string;
    tmdb_id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: Date;
    average_rating: number;
    genres: any[];
  };
}
