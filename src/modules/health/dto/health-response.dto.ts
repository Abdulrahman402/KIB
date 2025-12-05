import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Overall health status' })
  status: string;

  @ApiProperty({
    example: '2025-12-05T09:30:00.000Z',
    description: 'Timestamp of health check',
  })
  timestamp: string;

  @ApiProperty({
    example: 1234.56,
    description: 'Application uptime in seconds',
  })
  uptime: number;
}
