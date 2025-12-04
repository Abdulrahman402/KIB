import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenreResponseDto } from './dto';
import { PaginatedMoviesResponseDto } from '../movies/dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  /**
   * Get all genres (requires authentication)
   * GET /api/v1/genres
   */
  @Get()
  async findAll(): Promise<GenreResponseDto[]> {
    return this.genresService.findAll();
  }

  /**
   * Get genre by ID (requires authentication)
   * GET /api/v1/genres/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GenreResponseDto> {
    return this.genresService.findOne(id);
  }

  /**
   * Get movies by genre (requires authentication)
   * GET /api/v1/genres/:id/movies?page=1&limit=20
   */
  @Get(':id/movies')
  async getMoviesByGenre(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.genresService.getMoviesByGenre(id, page, limit);
  }
}
