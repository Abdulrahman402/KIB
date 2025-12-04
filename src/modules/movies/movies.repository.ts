import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';

export interface CreateMovieDto {
  tmdb_id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: Date | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genres: string[];
  original_language: string;
  adult: boolean;
}

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  /**
   * Bulk upsert movies
   */
  async bulkUpsert(
    movies: CreateMovieDto[],
  ): Promise<{ upsertedCount: number; modifiedCount: number }> {
    if (movies.length === 0) {
      return { upsertedCount: 0, modifiedCount: 0 };
    }

    const bulkOps = movies.map((movie) => ({
      updateOne: {
        filter: { tmdb_id: movie.tmdb_id },
        update: { $set: movie },
        upsert: true,
      },
    }));

    const result = await this.movieModel.bulkWrite(bulkOps);

    return {
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Find all movies with pagination
   */
  async findAll(
    limit: number = 20,
    skip: number = 0,
  ): Promise<MovieDocument[]> {
    return this.movieModel
      .find()
      .sort({ popularity: -1 })
      .limit(limit)
      .skip(skip)
      .populate('genres')
      .exec();
  }

  /**
   * Count total movies
   */
  async count(): Promise<number> {
    return this.movieModel.countDocuments().exec();
  }
}
