import { ApiProperty } from '@nestjs/swagger';

export class TerminalInfoResponseDto {
  @ApiProperty({ type: String, description: 'WebSocket URL to connect to the container terminal' })
  wsUrl: string;

  @ApiProperty({ type: String, description: 'Container ID to attach to' })
  containerId: string;
}
