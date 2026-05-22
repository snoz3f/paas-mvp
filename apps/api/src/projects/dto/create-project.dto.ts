import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'my-saas' })
  @IsString()
  @MinLength(1)
  name: string;
}
