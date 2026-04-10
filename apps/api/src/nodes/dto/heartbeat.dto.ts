import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class HeartbeatDto {
  @ApiProperty({ example: 45.2, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  cpuUsage: number;

  @ApiProperty({ example: 60.5, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  ramUsage: number;

  @ApiProperty({ example: 3, minimum: 0 })
  @IsInt()
  @Min(0)
  activeContainers: number;
}
