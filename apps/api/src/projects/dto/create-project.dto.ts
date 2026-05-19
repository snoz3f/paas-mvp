import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'my-backend' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'https://github.com/user/repo' })
  @IsUrl()
  repoUrl: string;

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

  @ApiPropertyOptional({ example: { NODE_ENV: 'production', DATABASE_URL: 'postgres://...' }, type: Object })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, string>;
}
