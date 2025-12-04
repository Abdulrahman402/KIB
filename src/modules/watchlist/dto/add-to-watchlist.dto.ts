import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class AddToWatchlistDto {
  @IsNotEmpty()
  @IsString()
  movie_id: string;

  @IsOptional()
  @IsBoolean()
  is_favorite?: boolean;
}
