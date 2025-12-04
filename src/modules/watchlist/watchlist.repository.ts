import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Watchlist, WatchlistDocument } from './schemas/watchlist.schema';

@Injectable()
export class WatchlistRepository {
  private readonly logger = new Logger(WatchlistRepository.name);

  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  /**
   * Add movie to watchlist
   */
  async create(
    userId: string,
    movieId: string,
    isFavorite: boolean = false,
  ): Promise<WatchlistDocument> {
    const watchlistItem = new this.watchlistModel({
      user_id: new Types.ObjectId(userId),
      movie_id: new Types.ObjectId(movieId),
      is_favorite: isFavorite,
      added_at: new Date(),
    });
    return watchlistItem.save();
  }

  /**
   * Find watchlist item by user and movie
   */
  async findByUserAndMovie(
    userId: string,
    movieId: string,
  ): Promise<WatchlistDocument | null> {
    return this.watchlistModel
      .findOne({
        user_id: new Types.ObjectId(userId),
        movie_id: new Types.ObjectId(movieId),
      })
      .populate('movie_id', 'title poster_path tmdb_id release_date')
      .exec();
  }

  /**
   * Find watchlist item by ID
   */
  async findById(id: string): Promise<WatchlistDocument | null> {
    return this.watchlistModel
      .findById(id)
      .populate('movie_id', 'title poster_path tmdb_id release_date')
      .exec();
  }

  /**
   * Get user's watchlist with pagination and filters
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isFavorite?: boolean,
  ): Promise<{ watchlist: WatchlistDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: any = { user_id: new Types.ObjectId(userId) };

    if (isFavorite !== undefined) {
      filter.is_favorite = isFavorite;
    }

    const [watchlist, total] = await Promise.all([
      this.watchlistModel
        .find(filter)
        .populate('movie_id', 'title poster_path tmdb_id release_date')
        .sort({ added_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.watchlistModel.countDocuments(filter),
    ]);

    return { watchlist, total };
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<WatchlistDocument | null> {
    const item = await this.watchlistModel.findById(id);
    if (!item) return null;

    item.is_favorite = !item.is_favorite;
    return item.save();
  }

  /**
   * Update favorite status
   */
  async updateFavorite(
    id: string,
    isFavorite: boolean,
  ): Promise<WatchlistDocument | null> {
    return this.watchlistModel
      .findByIdAndUpdate(id, { is_favorite: isFavorite }, { new: true })
      .populate('movie_id', 'title poster_path tmdb_id release_date')
      .exec();
  }

  /**
   * Remove from watchlist
   */
  async delete(id: string): Promise<WatchlistDocument | null> {
    return this.watchlistModel.findByIdAndDelete(id).exec();
  }

  /**
   * Count user's total watchlist items
   */
  async countByUser(userId: string, isFavorite?: boolean): Promise<number> {
    const filter: any = { user_id: new Types.ObjectId(userId) };
    if (isFavorite !== undefined) {
      filter.is_favorite = isFavorite;
    }
    return this.watchlistModel.countDocuments(filter).exec();
  }
}
