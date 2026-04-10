import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIP, IsOptional, IsString } from 'class-validator';

export class RegisterNodeDto {
  @ApiProperty({ example: 'hetzner-fsn1-1' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1.2.3.4' })
  @IsIP()
  ip: string;

  @ApiPropertyOptional({ example: 'eu-west' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'hetzner' })
  @IsString()
  @IsOptional()
  provider?: string;
}
