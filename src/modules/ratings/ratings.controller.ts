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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import {
  CreateRatingDto,
  UpdateRatingDto,
  RatingResponseDto,
  PaginatedRatingsResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('ratings')
@ApiBearerAuth('JWT-auth')
@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * Create a new rating (requires authentication)
   * POST /api/v1/ratings
   */
  @Post()
  @ApiOperation({
    summary: 'Rate a movie',
    description:
      'Create a new rating for a movie. Users can rate movies from 1 to 10.',
  })
  @ApiResponse({
    status: 201,
    description: 'Rating created successfully',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 409,
    description: 'User has already rated this movie',
  })
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
  @ApiOperation({
    summary: 'Get user ratings',
    description: 'Retrieve all ratings created by the authenticated user.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Ratings retrieved successfully',
    type: PaginatedRatingsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
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
  @ApiOperation({
    summary: 'Get rating by ID',
    description: 'Retrieve a specific rating by its MongoDB ObjectId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the rating' })
  @ApiResponse({
    status: 200,
    description: 'Rating retrieved successfully',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Rating belongs to another user',
  })
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
  @ApiOperation({
    summary: 'Update a rating',
    description:
      'Update an existing rating. Users can only update their own ratings.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the rating' })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Rating belongs to another user',
  })
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
  @ApiOperation({
    summary: 'Delete a rating',
    description: 'Remove a rating. Users can only delete their own ratings.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the rating' })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Rating belongs to another user',
  })
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.ratingsService.remove(id, req.user.userId);
  }
}
