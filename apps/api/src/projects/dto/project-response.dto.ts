import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;

  @ApiProperty({ example: 'my-backend' })
  name: string;

  @ApiProperty({ example: 'https://github.com/user/repo' })
  repoUrl: string;

  @ApiPropertyOptional({ example: 'my-backend.paas.dev', type: String, nullable: true })
  domain: string | null;

  @ApiPropertyOptional({ example: 'nestjs', type: String, nullable: true })
  framework: string | null;

  @ApiProperty({ example: 3000 })
  port: number;

  @ApiProperty({ example: { NODE_ENV: 'production' }, type: Object })
  envVars: Record<string, string>;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', type: Date })
  createdAt: Date;
}
