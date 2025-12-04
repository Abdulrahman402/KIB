import { IsBoolean } from 'class-validator';

export class UpdateWatchlistDto {
  @IsBoolean()
  is_favorite: boolean;
}
