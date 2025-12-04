import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { GenresRepository } from './genres.repository';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { MoviesRepository } from '../movies/movies.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [GenresController],
  providers: [GenresService, GenresRepository, MoviesRepository],
  exports: [GenresService, GenresRepository],
})
export class GenresModule {}
