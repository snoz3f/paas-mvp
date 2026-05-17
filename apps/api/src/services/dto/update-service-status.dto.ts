import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from '@/generated/prisma/client.js';

export class UpdateServiceStatusDto {
  @ApiProperty({ enum: ServiceStatus })
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  containerId?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  error?: string;
}
