import { Document } from 'mongoose';

export interface IMovie {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: Date;
  runtime: number;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genres: string[];
  average_rating: number;
  ratings_count: number;
  original_language: string;
  adult: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IMovieDocument extends IMovie, Document {}

export interface IMovieResponse {
  id: string;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: Date;
  runtime: number;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genres: any[];
  average_rating: number;
  ratings_count: number;
  original_language: string;
  adult: boolean;
  created_at: Date;
  updated_at: Date;
}
