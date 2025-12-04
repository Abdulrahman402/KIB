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
import { WatchlistService } from './watchlist.service';
import {
  AddToWatchlistDto,
  UpdateWatchlistDto,
  WatchlistResponseDto,
  PaginatedWatchlistResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  /**
   * Add movie to watchlist (requires authentication)
   * POST /api/v1/watchlist
   */
  @Post()
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
  async removeFromWatchlist(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.watchlistService.removeFromWatchlist(id, req.user.userId);
  }
}
