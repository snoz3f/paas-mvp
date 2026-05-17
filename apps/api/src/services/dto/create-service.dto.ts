import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export enum ServiceTypeDto {
  POSTGRES = 'POSTGRES',
  REDIS = 'REDIS',
}

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceTypeDto, example: ServiceTypeDto.POSTGRES })
  @IsEnum(ServiceTypeDto)
  type: ServiceTypeDto;

  @ApiPropertyOptional({ example: '16', description: 'Image version tag' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({
    example: 'DATABASE_URL',
    description: 'Env var name to inject connection string into',
  })
  @IsString()
  @MinLength(1)
  @Matches(/^[A-Z][A-Z0-9_]*$/, { message: 'Must be uppercase snake_case (e.g. DATABASE_URL)' })
  envKey: string;
}
