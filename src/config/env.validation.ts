import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
  Min,
  Max,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  // Application
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 8080;

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api/v1';

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string = '*';

  // Database
  @IsString()
  MONGODB_URI: string;

  // Redis
  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @Min(1)
  @Max(65535)
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @Min(1)
  REDIS_TTL: number = 300;

  // TMDB
  @IsString()
  TMDB_API_KEY: string;

  @IsString()
  @IsOptional()
  TMDB_BASE_URL: string = 'https://api.themoviedb.org/3';

  @IsString()
  @IsOptional()
  TMDB_IMAGE_BASE_URL: string = 'https://image.tmdb.org/t/p';

  @IsNumber()
  @Min(1)
  @Max(500)
  TMDB_SYNC_PAGES: number = 50;

  @IsString()
  @IsOptional()
  TMDB_SYNC_CRON: string = '0 2 * * *';

  // JWT
  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION: string = '7d';

  // Pagination
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  DEFAULT_PAGE_SIZE: number = 20;

  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  MAX_PAGE_SIZE: number = 100;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : '';
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(`Config validation error:\n${errorMessages}`);
  }

  return validatedConfig;
}
