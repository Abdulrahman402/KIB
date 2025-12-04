import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { MoviesModule } from './modules/movies/movies.module';
import { GenresModule } from './modules/genres/genres.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import tmdbConfig from './config/tmdb.config';
import redisConfig from './config/redis.config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig, jwtConfig, tmdbConfig, redisConfig],
      validate,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    TmdbModule,
    MoviesModule,
    GenresModule,
    RatingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
