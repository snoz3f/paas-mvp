import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RegisterNodeDto {
  @ApiProperty({ example: 'hetzner-fsn1-1' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1.2.3.4 or docker-service-name' })
  @IsString()
  ip: string;

  @ApiPropertyOptional({ example: 'eu-west' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'hetzner' })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({ example: 8192 })
  @IsInt()
  @IsOptional()
  totalRamMb?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  totalDiskGb?: number;
}
