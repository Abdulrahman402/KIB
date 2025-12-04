import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TmdbService } from './tmdb.service';
import { TmdbSyncService } from './tmdb-sync.service';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { Genre, GenreSchema } from '../genres/schemas/genre.schema';
import { GenresRepository } from '../genres/genres.repository';
import { MoviesRepository } from '../movies/movies.repository';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
    ]),
  ],
  providers: [TmdbService, TmdbSyncService, GenresRepository, MoviesRepository],
  exports: [TmdbService, TmdbSyncService],
})
export class TmdbModule {}
