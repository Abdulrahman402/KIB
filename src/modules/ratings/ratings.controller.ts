import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import {
  CreateRatingDto,
  UpdateRatingDto,
  RatingResponseDto,
  PaginatedRatingsResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * Create a new rating (requires authentication)
   * POST /api/v1/ratings
   */
  @Post()
  async create(
    @Request() req,
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<RatingResponseDto> {
    return this.ratingsService.create(req.user.userId, createRatingDto);
  }

  /**
   * Get current user's ratings (requires authentication)
   * GET /api/v1/ratings?page=1&limit=20
   */
  @Get()
  async getUserRatings(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PaginatedRatingsResponseDto> {
    return this.ratingsService.getUserRatings(req.user.userId, page, limit);
  }

  /**
   * Get rating by ID (requires authentication)
   * GET /api/v1/ratings/:id
   */
  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<RatingResponseDto> {
    return this.ratingsService.findOne(id, req.user.userId);
  }

  /**
   * Update rating (requires authentication)
   * PATCH /api/v1/ratings/:id
   */
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    return this.ratingsService.update(id, req.user.userId, updateRatingDto);
  }

  /**
   * Delete rating (requires authentication)
   * DELETE /api/v1/ratings/:id
   */
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.ratingsService.remove(id, req.user.userId);
  }
}
