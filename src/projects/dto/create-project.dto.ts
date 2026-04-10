import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

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
}
