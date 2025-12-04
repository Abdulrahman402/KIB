import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import {
  MovieQueryDto,
  SearchMovieDto,
  MovieResponseDto,
  PaginatedMoviesResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Get all movies (requires authentication)
   * GET /api/v1/movies?page=1&limit=20&genre=xxx&year=2024&minRating=7&sortBy=popularity&sortOrder=desc
   */
  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description:
      'Retrieve a paginated list of movies with optional filtering by genre, year, and rating. Supports sorting by various fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'Movies retrieved successfully',
    type: PaginatedMoviesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
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
  @ApiOperation({
    summary: 'Search movies',
    description: 'Search for movies by title. Minimum 2 characters required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: PaginatedMoviesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
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
  @ApiOperation({
    summary: 'Get movies by genre',
    description: 'Retrieve movies filtered by a specific genre ID.',
  })
  @ApiParam({ name: 'genreId', description: 'MongoDB ObjectId of the genre' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Movies retrieved successfully',
    type: PaginatedMoviesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
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
  @ApiOperation({
    summary: 'Get movie by TMDB ID',
    description: 'Retrieve a movie by its TMDB (The Movie Database) ID.',
  })
  @ApiParam({
    name: 'tmdbId',
    description: 'TMDB ID of the movie',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Movie retrieved successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
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
  @ApiOperation({
    summary: 'Get movie by ID',
    description: 'Retrieve a movie by its MongoDB ObjectId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the movie' })
  @ApiResponse({
    status: 200,
    description: 'Movie retrieved successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async findOne(@Param('id') id: string): Promise<MovieResponseDto> {
    return this.moviesService.findOne(id);
  }
}
