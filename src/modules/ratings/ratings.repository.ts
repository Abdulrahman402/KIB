import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';

@Injectable()
export class RatingsRepository {
  private readonly logger = new Logger(RatingsRepository.name);

  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  /**
   * Create a new rating
   */
  async create(
    userId: string,
    movieId: string,
    rating: number,
    review?: string,
  ): Promise<RatingDocument> {
    const newRating = new this.ratingModel({
      user_id: new Types.ObjectId(userId),
      movie_id: new Types.ObjectId(movieId),
      rating,
      review,
    });
    return newRating.save();
  }

  /**
   * Find rating by user and movie
   */
  async findByUserAndMovie(
    userId: string,
    movieId: string,
  ): Promise<RatingDocument | null> {
    return this.ratingModel
      .findOne({
        user_id: new Types.ObjectId(userId),
        movie_id: new Types.ObjectId(movieId),
      })
      .populate('movie_id', 'title poster_path tmdb_id')
      .exec();
  }

  /**
   * Find rating by ID
   */
  async findById(id: string): Promise<RatingDocument | null> {
    return this.ratingModel
      .findById(id)
      .populate('movie_id', 'title poster_path tmdb_id')
      .exec();
  }

  /**
   * Find all ratings by user with pagination
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ ratings: RatingDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      this.ratingModel
        .find({ user_id: new Types.ObjectId(userId) })
        .populate('movie_id', 'title poster_path tmdb_id release_date')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ratingModel.countDocuments({ user_id: new Types.ObjectId(userId) }),
    ]);

    return { ratings, total };
  }

  /**
   * Update rating
   */
  async update(
    id: string,
    rating: number,
    review?: string,
  ): Promise<RatingDocument | null> {
    return this.ratingModel
      .findByIdAndUpdate(
        id,
        { rating, review, updated_at: new Date() },
        { new: true },
      )
      .populate('movie_id', 'title poster_path tmdb_id')
      .exec();
  }

  /**
   * Delete rating
   */
  async delete(id: string): Promise<RatingDocument | null> {
    return this.ratingModel.findByIdAndDelete(id).exec();
  }

  /**
   * Calculate average rating for a movie
   */
  async calculateMovieAverage(
    movieId: string,
  ): Promise<{ average: number; count: number }> {
    const result = await this.ratingModel.aggregate([
      { $match: { movie_id: new Types.ObjectId(movieId) } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { average: 0, count: 0 };
    }

    return {
      average: Math.round(result[0].average * 10) / 10, // Round to 1 decimal
      count: result[0].count,
    };
  }

  /**
   * Count user's total ratings
   */
  async countByUser(userId: string): Promise<number> {
    return this.ratingModel
      .countDocuments({ user_id: new Types.ObjectId(userId) })
      .exec();
  }
}
