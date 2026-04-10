import { ApiProperty } from '@nestjs/swagger';

export class RegisterNodeResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  nodeId: string;
}
