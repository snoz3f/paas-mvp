import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  projectId: string;

  @ApiProperty({ enum: ['POSTGRES', 'REDIS'], example: 'POSTGRES' })
  type: string;

  @ApiProperty({ enum: ['PROVISIONING', 'RUNNING', 'FAILED', 'STOPPED'], example: 'RUNNING' })
  status: string;

  @ApiProperty({ example: '16' })
  version: string;

  @ApiProperty({ example: 'DATABASE_URL' })
  envKey: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  containerId: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  nodeId: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
