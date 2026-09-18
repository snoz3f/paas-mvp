import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() projectId: string;
  @ApiProperty() name: string;
  @ApiProperty() repoUrl: string;
  @ApiPropertyOptional() domain?: string | null;
  @ApiPropertyOptional() framework?: string | null;
  @ApiProperty() port: number;
  @ApiProperty({ type: Object }) envVars: Record<string, string>;
  @ApiProperty() hasGitToken: boolean;
  @ApiProperty() createdAt: Date;
}
