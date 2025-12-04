import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { RatingsRepository } from './ratings.repository';
import { MoviesRepository } from '../movies/movies.repository';
import {
  CreateRatingDto,
  UpdateRatingDto,
  RatingResponseDto,
  PaginatedRatingsResponseDto,
} from './dto';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);

  constructor(
    private readonly ratingsRepository: RatingsRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  /**
   * Create a new rating
   */
  async create(
    userId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<RatingResponseDto> {
    this.logger.log(
      `User ${userId} creating rating for movie ${createRatingDto.movie_id}`,
    );

    // Verify movie exists
    const movie = await this.moviesRepository.findById(
      createRatingDto.movie_id,
    );
    if (!movie) {
      throw new NotFoundException(
        `Movie with ID ${createRatingDto.movie_id} not found`,
      );
    }

    // Check if user already rated this movie
    const existingRating = await this.ratingsRepository.findByUserAndMovie(
      userId,
      createRatingDto.movie_id,
    );

    if (existingRating) {
      throw new ConflictException(
        'You have already rated this movie. Use PATCH to update your rating.',
      );
    }

    // Create rating
    const rating = await this.ratingsRepository.create(
      userId,
      createRatingDto.movie_id,
      createRatingDto.rating,
      createRatingDto.review,
    );

    // Update movie average rating
    await this.updateMovieAverageRating(createRatingDto.movie_id);

    this.logger.log(`Rating created: ${rating._id}`);

    return this.toRatingResponse(rating);
  }

  /**
   * Get user's ratings with pagination
   */
  async getUserRatings(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedRatingsResponseDto> {
    this.logger.log(`Fetching ratings for user ${userId}`);

    const { ratings, total } = await this.ratingsRepository.findByUser(
      userId,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: ratings.map((rating) => this.toRatingResponse(rating)),
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
   * Get rating by ID
   */
  async findOne(id: string, userId: string): Promise<RatingResponseDto> {
    this.logger.log(`Fetching rating ${id}`);

    const rating = await this.ratingsRepository.findById(id);

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Ensure user owns this rating
    if (rating.user_id.toString() !== userId) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return this.toRatingResponse(rating);
  }

  /**
   * Update rating
   */
  async update(
    id: string,
    userId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    this.logger.log(`User ${userId} updating rating ${id}`);

    const existingRating = await this.ratingsRepository.findById(id);

    if (!existingRating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Ensure user owns this rating
    if (existingRating.user_id.toString() !== userId) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Update rating
    const rating = await this.ratingsRepository.update(
      id,
      updateRatingDto.rating ?? existingRating.rating,
      updateRatingDto.review !== undefined
        ? updateRatingDto.review
        : existingRating.review,
    );

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Update movie average rating if rating value changed
    if (updateRatingDto.rating !== undefined) {
      await this.updateMovieAverageRating(rating.movie_id.toString());
    }

    this.logger.log(`Rating updated: ${id}`);

    return this.toRatingResponse(rating);
  }

  /**
   * Delete rating
   */
  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`User ${userId} deleting rating ${id}`);

    const rating = await this.ratingsRepository.findById(id);

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Ensure user owns this rating
    if (rating.user_id.toString() !== userId) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    const movieId = rating.movie_id.toString();

    await this.ratingsRepository.delete(id);

    // Update movie average rating
    await this.updateMovieAverageRating(movieId);

    this.logger.log(`Rating deleted: ${id}`);
  }

  /**
   * Update movie's average rating
   */
  private async updateMovieAverageRating(movieId: string): Promise<void> {
    const { average, count } =
      await this.ratingsRepository.calculateMovieAverage(movieId);

    await this.moviesRepository.updateAverageRating(movieId, average, count);

    this.logger.log(
      `Updated movie ${movieId} average rating: ${average} (${count} ratings)`,
    );
  }

  /**
   * Transform rating document to response DTO
   */
  private toRatingResponse(rating: any): RatingResponseDto {
    return {
      id: rating._id.toString(),
      user_id: rating.user_id.toString(),
      movie: {
        id: rating.movie_id._id?.toString() || rating.movie_id.id,
        title: rating.movie_id.title,
        poster_path: rating.movie_id.poster_path,
        tmdb_id: rating.movie_id.tmdb_id,
        release_date: rating.movie_id.release_date,
      },
      rating: rating.rating,
      review: rating.review,
      created_at: rating.created_at,
      updated_at: rating.updated_at,
    };
  }
}
