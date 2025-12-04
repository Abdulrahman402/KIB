import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { GenreResponseDto } from './dto';
import { PaginatedMoviesResponseDto } from '../movies/dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('genres')
@ApiBearerAuth('JWT-auth')
@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  /**
   * Get all genres (requires authentication)
   * GET /api/v1/genres
   */
  @Get()
  @ApiOperation({
    summary: 'Get all genres',
    description: 'Retrieve a list of all available movie genres.',
  })
  @ApiResponse({
    status: 200,
    description: 'Genres retrieved successfully',
    type: [GenreResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async findAll(): Promise<GenreResponseDto[]> {
    return this.genresService.findAll();
  }

  /**
   * Get movies by genre (requires authentication)
   * GET /api/v1/genres/:id/movies?page=1&limit=20
   */
  @Get(':id/movies')
  @ApiOperation({
    summary: 'Get movies by genre',
    description: 'Retrieve all movies belonging to a specific genre.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the genre' })
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
  async getMoviesByGenre(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.genresService.getMoviesByGenre(id, page, limit);
  }
}
