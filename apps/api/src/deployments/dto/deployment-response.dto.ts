import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeploymentStatus } from '@/generated/prisma/client.js';

export class DeploymentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  projectId: string;

  @ApiProperty({ enum: DeploymentStatus, example: DeploymentStatus.QUEUED })
  status: DeploymentStatus;

  @ApiPropertyOptional({ type: String, example: '550e8400-e29b-41d4-a716-446655440002' })
  nodeId: string | null;

  @ApiPropertyOptional({ type: String, example: 'abc123def456' })
  containerId: string | null;

  @ApiPropertyOptional({ type: String, example: 'https://my-app.paas.dev' })
  url: string | null;

  @ApiPropertyOptional({ type: String, example: 'Build failed: no Dockerfile found' })
  error: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  startedAt: Date | null;

  @ApiPropertyOptional()
  finishedAt: Date | null;
}
