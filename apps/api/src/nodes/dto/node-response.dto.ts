import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NodeStatus } from '@/generated/prisma/client.js';

export class NodeResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'hetzner-fsn1-1' })
  name: string;

  @ApiProperty({ example: '1.2.3.4' })
  ip: string;

  @ApiPropertyOptional({ example: 'eu-west' })
  region: string | null;

  @ApiPropertyOptional({ example: 'hetzner' })
  provider: string | null;

  @ApiProperty({ enum: NodeStatus, example: NodeStatus.ONLINE })
  status: NodeStatus;

  @ApiProperty({ example: 45.2 })
  cpuUsage: number;

  @ApiProperty({ example: 60.5 })
  ramUsage: number;

  @ApiProperty({ example: 3 })
  activeContainers: number;

  @ApiPropertyOptional()
  lastHeartbeat: Date | null;
}
