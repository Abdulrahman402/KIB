import { Document } from 'mongoose';

export interface IGenre {
  tmdb_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IGenreDocument extends IGenre, Document {}

export interface IGenreResponse {
  id: string;
  tmdb_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}
