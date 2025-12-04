import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TmdbService } from './tmdb.service';
import { GenresRepository } from '../genres/genres.repository';
import { MoviesRepository } from '../movies/movies.repository';

@Injectable()
export class TmdbSyncService {
  private readonly logger = new Logger(TmdbSyncService.name);
  private isSyncing = false;
  private readonly BATCH_SIZE = 1000;
  private readonly RATE_LIMIT_DELAY = 1000; // ms between requests

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly genresRepository: GenresRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  /**
   * Sync genres from TMDB - Runs once daily at 1 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'sync-tmdb-genres',
    timeZone: 'UTC',
  })
  async syncGenres(): Promise<{ success: boolean; synced: number }> {
    this.logger.log('Starting TMDB genres sync...');

    try {
      const response = await this.tmdbService.fetchGenres();

      // Transform and upsert using repository
      const genres = response.genres.map((genre) => ({
        tmdb_id: genre.id,
        name: genre.name,
      }));

      const result = await this.genresRepository.bulkUpsert(genres);
      const syncedCount = result.upsertedCount + result.modifiedCount;

      this.logger.log(
        `TMDB genres sync completed: ${syncedCount} genres synced`,
      );

      return { success: true, synced: syncedCount };
    } catch (error) {
      this.logger.error(
        `TMDB genres sync failed: ${error.message}`,
        error.stack,
      );
      return { success: false, synced: 0 };
    }
  }

  /**
   * Sync movies from TMDB - Runs daily at 2 AM
   * Fetches movies in batches of 1000 (50 pages x 20 movies per page)
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'sync-tmdb-movies',
    timeZone: 'UTC',
  })
  async syncMovies(): Promise<{
    success: boolean;
    synced: number;
    failed: number;
  }> {
    if (this.isSyncing) {
      this.logger.warn('Movie sync already in progress, skipping...');
      return { success: false, synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.logger.log('Starting TMDB movies sync...');

    try {
      // First, ensure genres are synced
      await this.syncGenres();

      // Build genre mapping (tmdb_id -> MongoDB _id)
      const genres = await this.genresRepository.findAll();
      const genreMap = new Map(
        genres.map((g) => [g.tmdb_id, g._id.toString()]),
      );

      let totalSynced = 0;
      let totalFailed = 0;
      const currentBatch: any[] = [];

      // Calculate pages needed for 1000 movies (50 pages x 20 movies = 1000)
      const pagesPerBatch = Math.ceil(this.BATCH_SIZE / 20);

      this.logger.log(
        `Fetching ${this.BATCH_SIZE} movies (${pagesPerBatch} pages)...`,
      );

      for (let page = 1; page <= pagesPerBatch; page++) {
        try {
          const response = await this.tmdbService.fetchMovies(page);

          // Transform and add to current batch
          response.results.forEach((movie) => {
            currentBatch.push({
              tmdb_id: movie.id,
              title: movie.title,
              original_title: movie.original_title,
              overview: movie.overview,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              release_date: movie.release_date
                ? new Date(movie.release_date)
                : null,
              popularity: movie.popularity,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              genres: movie.genre_ids
                .map((genreId) => genreMap.get(genreId))
                .filter(Boolean),
              original_language: movie.original_language,
              adult: movie.adult,
            });
          });

          this.logger.debug(
            `Fetched page ${page}/${pagesPerBatch} (${response.results.length} movies)`,
          );

          // Rate limiting
          if (page < pagesPerBatch) {
            await this.delay(this.RATE_LIMIT_DELAY);
          }
        } catch (error) {
          this.logger.error(
            `Failed to fetch page ${page}: ${error.message}`,
            error.stack,
          );
          totalFailed += 20; // Assume 20 movies per page
        }
      }

      // Batch upsert all movies using repository
      if (currentBatch.length > 0) {
        try {
          const result = await this.moviesRepository.bulkUpsert(currentBatch);
          totalSynced = result.upsertedCount + result.modifiedCount;

          this.logger.log(
            `Batch upsert completed: ${totalSynced} movies synced`,
          );
        } catch (error) {
          this.logger.error(
            `Batch upsert failed: ${error.message}`,
            error.stack,
          );
          totalFailed += currentBatch.length;
        }
      }

      this.logger.log(
        `TMDB movies sync completed: ${totalSynced} synced, ${totalFailed} failed`,
      );

      return { success: true, synced: totalSynced, failed: totalFailed };
    } catch (error) {
      this.logger.error(
        `TMDB movies sync failed: ${error.message}`,
        error.stack,
      );
      return { success: false, synced: 0, failed: 0 };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Manual trigger for full sync (genres + movies)
   */
  async triggerSync(): Promise<{
    success: boolean;
    genres: number;
    movies: number;
  }> {
    const genresResult = await this.syncGenres();
    const moviesResult = await this.syncMovies();

    return {
      success: genresResult.success && moviesResult.success,
      genres: genresResult.synced,
      movies: moviesResult.synced,
    };
  }

  /**
   * Utility: Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
