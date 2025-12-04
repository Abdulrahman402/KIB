import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { WatchlistRepository } from './watchlist.repository';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { MoviesRepository } from '../movies/movies.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Watchlist.name, schema: WatchlistSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService, WatchlistRepository, MoviesRepository],
  exports: [WatchlistService, WatchlistRepository],
})
export class WatchlistModule {}
