import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWatchlistDto {
  @ApiProperty({
    description: 'Mark/unmark as favorite',
    example: true,
  })
  @IsBoolean()
  is_favorite: boolean;
}
