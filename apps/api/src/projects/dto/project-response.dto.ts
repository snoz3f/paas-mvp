import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() name: string;
  @ApiProperty() createdAt: Date;
}
