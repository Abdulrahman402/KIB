import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingsRepository } from './ratings.repository';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { MoviesRepository } from '../movies/movies.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService, RatingsRepository, MoviesRepository],
  exports: [RatingsService, RatingsRepository],
})
export class RatingsModule {}
