import { registerAs } from '@nestjs/config';

export default registerAs('tmdb', () => ({
  apiKey: process.env.TMDB_API_KEY,
  baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  syncPages: parseInt(process.env.TMDB_SYNC_PAGES, 10) || 50,
  syncCron: process.env.TMDB_SYNC_CRON || '0 2 * * *',
}));
