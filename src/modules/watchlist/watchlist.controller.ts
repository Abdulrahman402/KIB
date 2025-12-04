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
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import {
  AddToWatchlistDto,
  UpdateWatchlistDto,
  WatchlistResponseDto,
  PaginatedWatchlistResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('watchlist')
@ApiBearerAuth('JWT-auth')
@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  /**
   * Add movie to watchlist (requires authentication)
   * POST /api/v1/watchlist
   */
  @Post()
  @ApiOperation({
    summary: 'Add movie to watchlist',
    description:
      "Add a movie to the user's watchlist and optionally mark it as favorite.",
  })
  @ApiResponse({
    status: 201,
    description: 'Movie added to watchlist successfully',
    type: WatchlistResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 409, description: 'Movie already in watchlist' })
  async addToWatchlist(
    @Request() req,
    @Body() addToWatchlistDto: AddToWatchlistDto,
  ): Promise<WatchlistResponseDto> {
    return this.watchlistService.addToWatchlist(
      req.user.userId,
      addToWatchlistDto,
    );
  }

  /**
   * Get current user's watchlist (requires authentication)
   * GET /api/v1/watchlist?page=1&limit=20&is_favorite=true
   */
  @Get()
  @ApiOperation({
    summary: 'Get user watchlist',
    description:
      "Retrieve the user's watchlist with optional filter for favorites only.",
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({
    name: 'is_favorite',
    required: false,
    type: Boolean,
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Watchlist retrieved successfully',
    type: PaginatedWatchlistResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getUserWatchlist(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('is_favorite', new ParseBoolPipe({ optional: true }))
    isFavorite?: boolean,
  ): Promise<PaginatedWatchlistResponseDto> {
    return this.watchlistService.getUserWatchlist(
      req.user.userId,
      page,
      limit,
      isFavorite,
    );
  }

  /**
   * Get watchlist item by ID (requires authentication)
   * GET /api/v1/watchlist/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get watchlist item by ID',
    description: 'Retrieve a specific watchlist item by its MongoDB ObjectId.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the watchlist item',
  })
  @ApiResponse({
    status: 200,
    description: 'Watchlist item retrieved successfully',
    type: WatchlistResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Watchlist item belongs to another user',
  })
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<WatchlistResponseDto> {
    return this.watchlistService.findOne(id, req.user.userId);
  }

  /**
   * Update watchlist item favorite status (requires authentication)
   * PATCH /api/v1/watchlist/:id/favorite
   */
  @Patch(':id/favorite')
  @ApiOperation({
    summary: 'Update favorite status',
    description: 'Mark or unmark a watchlist item as favorite.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the watchlist item',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorite status updated successfully',
    type: WatchlistResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Watchlist item belongs to another user',
  })
  async updateFavorite(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
  ): Promise<WatchlistResponseDto> {
    return this.watchlistService.updateFavorite(
      id,
      req.user.userId,
      updateWatchlistDto,
    );
  }

  /**
   * Remove movie from watchlist (requires authentication)
   * DELETE /api/v1/watchlist/:id
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove from watchlist',
    description: "Remove a movie from the user's watchlist.",
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the watchlist item',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie removed from watchlist successfully',
  })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Watchlist item belongs to another user',
  })
  async removeFromWatchlist(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.watchlistService.removeFromWatchlist(id, req.user.userId);
  }
}
