import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class UpdateAppDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  repoUrl?: string;

  @ApiPropertyOptional({ example: '.', description: 'Root directory within the repo' })
  @IsString()
  @IsOptional()
  rootDir?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  framework?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  @ApiPropertyOptional({ type: Object })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, string>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gitToken?: string;

  @ApiPropertyOptional({ example: 512, description: 'Memory limit in megabytes' })
  @IsInt()
  @Min(1)
  @IsOptional()
  ramMb?: number;

  @ApiPropertyOptional({ example: 500, description: 'CPU limit in milli-CPUs' })
  @IsInt()
  @Min(1)
  @IsOptional()
  cpuMilli?: number;

  @ApiPropertyOptional({ example: 5, description: 'Disk size in gigabytes' })
  @IsInt()
  @Min(1)
  @IsOptional()
  diskGb?: number;
}
