import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import {
  MovieQueryDto,
  SearchMovieDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from './dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private readonly moviesRepository: MoviesRepository) {}

  /**
   * Get all movies with pagination and filters
   */
  async findAll(queryDto: MovieQueryDto): Promise<PaginatedMoviesResponseDto> {
    const { page, limit, genre, year, minRating, sortBy, sortOrder } = queryDto;

    this.logger.log(
      `Fetching movies - Page: ${page}, Limit: ${limit}, Filters: ${JSON.stringify({ genre, year, minRating })}`,
    );

    const { movies, total } = await this.moviesRepository.findAll(
      page,
      limit,
      { genre, year, minRating },
      sortBy,
      sortOrder,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: movies.map((movie) => this.toMovieResponse(movie)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get movie by ID
   */
  async findOne(id: string): Promise<MovieResponseDto> {
    this.logger.log(`Fetching movie with ID: ${id}`);

    const movie = await this.moviesRepository.findById(id);

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return this.toMovieResponse(movie);
  }

  /**
   * Get movie by TMDB ID
   */
  async findByTmdbId(tmdbId: number): Promise<MovieResponseDto> {
    this.logger.log(`Fetching movie with TMDB ID: ${tmdbId}`);

    const movie = await this.moviesRepository.findByTmdbId(tmdbId);

    if (!movie) {
      throw new NotFoundException(`Movie with TMDB ID ${tmdbId} not found`);
    }

    return this.toMovieResponse(movie);
  }

  /**
   * Search movies
   */
  async search(searchDto: SearchMovieDto): Promise<PaginatedMoviesResponseDto> {
    const { query, page, limit } = searchDto;

    this.logger.log(`Searching movies with query: "${query}"`);

    const { movies, total } = await this.moviesRepository.search(
      query,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: movies.map((movie) => this.toMovieResponse(movie)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get movies by genre
   */
  async findByGenre(
    genreId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedMoviesResponseDto> {
    this.logger.log(`Fetching movies for genre ID: ${genreId}`);

    const { movies, total } = await this.moviesRepository.findByGenre(
      genreId,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: movies.map((movie) => this.toMovieResponse(movie)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Transform movie document to response DTO
   */
  private toMovieResponse(movie: any): MovieResponseDto {
    return {
      id: movie.id || movie._id.toString(),
      tmdb_id: movie.tmdb_id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      runtime: movie.runtime,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      average_rating: movie.average_rating || 0,
      ratings_count: movie.ratings_count || 0,
      original_language: movie.original_language,
      adult: movie.adult,
      genres: (movie.genres || []).map((genre: any) => ({
        id: genre.id || genre._id.toString(),
        name: genre.name,
        tmdb_id: genre.tmdb_id,
      })),
      created_at: movie.created_at,
      updated_at: movie.updated_at,
    };
  }
}
