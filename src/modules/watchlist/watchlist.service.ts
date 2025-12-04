import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { WatchlistRepository } from './watchlist.repository';
import { MoviesRepository } from '../movies/movies.repository';
import {
  AddToWatchlistDto,
  UpdateWatchlistDto,
  WatchlistResponseDto,
  PaginatedWatchlistResponseDto,
} from './dto';

@Injectable()
export class WatchlistService {
  private readonly logger = new Logger(WatchlistService.name);

  constructor(
    private readonly watchlistRepository: WatchlistRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  /**
   * Add movie to watchlist
   */
  async addToWatchlist(
    userId: string,
    addToWatchlistDto: AddToWatchlistDto,
  ): Promise<WatchlistResponseDto> {
    this.logger.log(
      `User ${userId} adding movie ${addToWatchlistDto.movie_id} to watchlist`,
    );

    // Verify movie exists
    const movie = await this.moviesRepository.findById(
      addToWatchlistDto.movie_id,
    );
    if (!movie) {
      throw new NotFoundException(
        `Movie with ID ${addToWatchlistDto.movie_id} not found`,
      );
    }

    // Check if already in watchlist
    const existing = await this.watchlistRepository.findByUserAndMovie(
      userId,
      addToWatchlistDto.movie_id,
    );

    if (existing) {
      throw new ConflictException('Movie already in your watchlist');
    }

    // Add to watchlist
    const watchlistItem = await this.watchlistRepository.create(
      userId,
      addToWatchlistDto.movie_id,
      addToWatchlistDto.is_favorite ?? false,
    );

    this.logger.log(`Watchlist item created: ${watchlistItem._id}`);

    return this.toWatchlistResponse(watchlistItem);
  }

  /**
   * Get user's watchlist with pagination and filters
   */
  async getUserWatchlist(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isFavorite?: boolean,
  ): Promise<PaginatedWatchlistResponseDto> {
    this.logger.log(`Fetching watchlist for user ${userId}`);

    const { watchlist, total } = await this.watchlistRepository.findByUser(
      userId,
      page,
      limit,
      isFavorite,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: watchlist.map((item) => this.toWatchlistResponse(item)),
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
   * Get watchlist item by ID
   */
  async findOne(id: string, userId: string): Promise<WatchlistResponseDto> {
    this.logger.log(`Fetching watchlist item ${id}`);

    const item = await this.watchlistRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    // Ensure user owns this item
    if (item.user_id.toString() !== userId) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    return this.toWatchlistResponse(item);
  }

  /**
   * Update watchlist item (toggle favorite)
   */
  async updateFavorite(
    id: string,
    userId: string,
    updateWatchlistDto: UpdateWatchlistDto,
  ): Promise<WatchlistResponseDto> {
    this.logger.log(`User ${userId} updating watchlist item ${id}`);

    const item = await this.watchlistRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    // Ensure user owns this item
    if (item.user_id.toString() !== userId) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    const updated = await this.watchlistRepository.updateFavorite(
      id,
      updateWatchlistDto.is_favorite,
    );

    if (!updated) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    this.logger.log(`Watchlist item updated: ${id}`);

    return this.toWatchlistResponse(updated);
  }

  /**
   * Remove movie from watchlist
   */
  async removeFromWatchlist(id: string, userId: string): Promise<void> {
    this.logger.log(`User ${userId} removing watchlist item ${id}`);

    const item = await this.watchlistRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    // Ensure user owns this item
    if (item.user_id.toString() !== userId) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    await this.watchlistRepository.delete(id);

    this.logger.log(`Watchlist item removed: ${id}`);
  }

  /**
   * Transform watchlist document to response DTO
   */
  private toWatchlistResponse(item: any): WatchlistResponseDto {
    return {
      id: item._id.toString(),
      user_id: item.user_id.toString(),
      movie: {
        id: item.movie_id._id?.toString() || item.movie_id.id,
        title: item.movie_id.title,
        poster_path: item.movie_id.poster_path,
        tmdb_id: item.movie_id.tmdb_id,
        release_date: item.movie_id.release_date,
      },
      is_favorite: item.is_favorite,
      added_at: item.added_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }
}
