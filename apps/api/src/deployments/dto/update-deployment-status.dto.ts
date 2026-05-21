import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DeploymentStatus } from '@/generated/prisma/client.js';

export class UpdateDeploymentStatusDto {
  @ApiProperty({ enum: DeploymentStatus, example: DeploymentStatus.RUNNING })
  @IsEnum(DeploymentStatus)
  status: DeploymentStatus;

  @ApiPropertyOptional({ example: 'abc123def456' })
  @IsString()
  @IsOptional()
  containerId?: string;

  @ApiPropertyOptional({ example: 'https://my-app.paas.dev' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ example: 'Build failed: no Dockerfile found' })
  @IsString()
  @IsOptional()
  error?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logs?: string;
}
