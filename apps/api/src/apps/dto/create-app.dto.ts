import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator';

export class CreateAppDto {
  @ApiProperty({ example: 'backend' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'https://github.com/user/repo' })
  @IsUrl()
  repoUrl: string;

  @ApiPropertyOptional({ example: '.', description: 'Root directory within the repo' })
  @IsString()
  @IsOptional()
  rootDir?: string;

  @ApiPropertyOptional({ example: 'nestjs' })
  @IsString()
  @IsOptional()
  framework?: string;

  @ApiPropertyOptional({ example: 3000 })
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  @ApiPropertyOptional({ example: { NODE_ENV: 'production' }, type: Object })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, string>;

  @ApiPropertyOptional({ example: 'ghp_xxxx', description: 'GitHub/GitLab PAT for private repos' })
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
