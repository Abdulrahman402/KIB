import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  MovieQueryDto,
  SearchMovieDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Get all movies (requires authentication)
   * GET /api/v1/movies?page=1&limit=20&genre=xxx&year=2024&minRating=7&sortBy=popularity&sortOrder=desc
   */
  @Get()
  async findAll(
    @Query() queryDto: MovieQueryDto,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.moviesService.findAll(queryDto);
  }

  /**
   * Search movies (requires authentication)
   * GET /api/v1/movies/search?query=inception&page=1&limit=20
   */
  @Get('search')
  async search(
    @Query() searchDto: SearchMovieDto,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.moviesService.search(searchDto);
  }

  /**
   * Get movies by genre (requires authentication)
   * GET /api/v1/movies/genre/:genreId?page=1&limit=20
   */
  @Get('genre/:genreId')
  async findByGenre(
    @Param('genreId') genreId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.moviesService.findByGenre(genreId, page, limit);
  }

  /**
   * Get movie by TMDB ID (requires authentication)
   * GET /api/v1/movies/tmdb/:tmdbId
   */
  @Get('tmdb/:tmdbId')
  async findByTmdbId(
    @Param('tmdbId') tmdbId: number,
  ): Promise<MovieResponseDto> {
    return this.moviesService.findByTmdbId(tmdbId);
  }

  /**
   * Get movie by ID (requires authentication)
   * GET /api/v1/movies/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieResponseDto> {
    return this.moviesService.findOne(id);
  }
}
