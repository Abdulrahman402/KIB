import { Document } from 'mongoose';

export interface IRating {
  user_id: string;
  movie_id: string;
  rating: number;
  review?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRatingDocument extends IRating, Document {}

export interface IRatingResponse {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  review?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRatingWithUser extends IRatingResponse {
  user: {
    id: string;
    username: string;
  };
}

export interface IRatingWithMovie extends IRatingResponse {
  movie: {
    id: string;
    title: string;
    poster_path: string;
  };
}
