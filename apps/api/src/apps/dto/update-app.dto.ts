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
}
