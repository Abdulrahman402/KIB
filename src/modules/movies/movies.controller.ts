import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
