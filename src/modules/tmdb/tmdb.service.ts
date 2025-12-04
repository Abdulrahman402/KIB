import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  TMDBMovieResponse,
  TMDBGenresResponse,
} from './interfaces/tmdb-response.interface';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');

    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL');
  }

  async fetchMovies(page: number = 1): Promise<TMDBMovieResponse> {
    try {
      this.logger.debug(`Fetching popular movies - Page ${page}`);

      const response = await firstValueFrom(
        this.httpService.get<TMDBMovieResponse>(
          `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}&language=en-US`,
        ),
      );

      this.logger.debug(
        `Successfully fetched ${response.data.results.length} movies from page ${page}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular movies from TMDB: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async fetchGenres(): Promise<TMDBGenresResponse> {
    try {
      this.logger.debug('Fetching genres from TMDB');

      const response = await firstValueFrom(
        this.httpService.get<TMDBGenresResponse>(
          `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`,
        ),
      );

      this.logger.debug(
        `Successfully fetched ${response.data.genres.length} genres`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch genres from TMDB: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
