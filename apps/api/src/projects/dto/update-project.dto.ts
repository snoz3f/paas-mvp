import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;
}
