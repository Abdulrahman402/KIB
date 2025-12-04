import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GenresRepository } from './genres.repository';
import { MoviesRepository } from '../movies/movies.repository';
import { GenreResponseDto } from './dto';
import { PaginatedMoviesResponseDto } from '../movies/dto';

@Injectable()
export class GenresService {
  private readonly logger = new Logger(GenresService.name);

  constructor(
    private readonly genresRepository: GenresRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  /**
   * Get all genres
   */
  async findAll(): Promise<GenreResponseDto[]> {
    this.logger.log('Fetching all genres');

    const genres = await this.genresRepository.findAll();

    return genres.map((genre) => this.toGenreResponse(genre));
  }

  /**
   * Get movies by genre ID with pagination
   */
  async getMoviesByGenre(
    genreId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedMoviesResponseDto> {
    this.logger.log(`Fetching movies for genre ID: ${genreId}`);

    // Verify genre exists
    const genre = await this.genresRepository.findById(genreId);
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${genreId} not found`);
    }

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
   * Transform genre document to response DTO
   */
  private toGenreResponse(genre: any): GenreResponseDto {
    return {
      id: genre.id || genre._id.toString(),
      tmdb_id: genre.tmdb_id,
      name: genre.name,
      created_at: genre.created_at,
      updated_at: genre.updated_at,
    };
  }

  /**
   * Transform movie document to response DTO
   */
  private toMovieResponse(movie: any): any {
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
