import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

export interface MovieFilters {
  genre?: string;
  year?: number;
  minRating?: number;
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
   * Find all movies with pagination and filters
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: MovieFilters = {},
    sortBy: string = 'popularity',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ movies: MovieDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Apply filters
    if (filters.genre) {
      query.genres = new Types.ObjectId(filters.genre);
    }

    if (filters.year) {
      const startDate = new Date(`${filters.year}-01-01`);
      const endDate = new Date(`${filters.year}-12-31`);
      query.release_date = { $gte: startDate, $lte: endDate };
    }

    if (filters.minRating !== undefined) {
      query.average_rating = { $gte: filters.minRating };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [movies, total] = await Promise.all([
      this.movieModel
        .find(query)
        .populate('genres', 'name tmdb_id')
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .exec(),
      this.movieModel.countDocuments(query).exec(),
    ]);

    return { movies, total };
  }

  /**
   * Find movie by ID
   */
  async findById(id: string): Promise<MovieDocument | null> {
    return this.movieModel
      .findById(id)
      .populate('genres', 'name tmdb_id')
      .exec();
  }

  /**
   * Search movies by title or overview
   */
  async search(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ movies: MovieDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const searchQuery = {
      $text: { $search: query },
    };

    const [movies, total] = await Promise.all([
      this.movieModel
        .find(searchQuery, { score: { $meta: 'textScore' } })
        .populate('genres', 'name tmdb_id')
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .exec(),
      this.movieModel.countDocuments(searchQuery).exec(),
    ]);

    return { movies, total };
  }

  /**
   * Get movies by genre
   */
  async findByGenre(
    genreId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ movies: MovieDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { genres: new Types.ObjectId(genreId) };

    const [movies, total] = await Promise.all([
      this.movieModel
        .find(query)
        .populate('genres', 'name tmdb_id')
        .sort({ popularity: -1 })
        .limit(limit)
        .skip(skip)
        .exec(),
      this.movieModel.countDocuments(query).exec(),
    ]);

    return { movies, total };
  }

  /**
   * Count total movies
   */
  async count(): Promise<number> {
    return this.movieModel.countDocuments().exec();
  }

  /**
   * Update movie's average rating
   */
  async updateAverageRating(
    movieId: string,
    averageRating: number,
    ratingsCount: number,
  ): Promise<void> {
    await this.movieModel
      .findByIdAndUpdate(movieId, {
        average_rating: averageRating,
        ratings_count: ratingsCount,
      })
      .exec();
  }
}
