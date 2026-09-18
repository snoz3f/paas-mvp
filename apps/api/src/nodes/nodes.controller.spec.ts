jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { InternalNodesController } from './nodes.controller';
import type { HeartbeatDto } from './dto/heartbeat.dto';
import type { RegisterNodeDto } from './dto/register-node.dto';

describe('InternalNodesController', () => {
  it('passes x-node-token header into register and heartbeat', async () => {
    const nodesService = {
      register: jest.fn().mockResolvedValue({ nodeId: 'n1' }),
      heartbeat: jest.fn().mockResolvedValue(undefined),
    };
    const controller = new InternalNodesController(nodesService as never);
    const dto: RegisterNodeDto = { name: 'worker-01', ip: '10.0.0.1' };
    const hb: HeartbeatDto = { cpuUsage: 1, ramUsage: 2, activeContainers: 0 };

    await controller.register(dto, 'test-secret-value');
    expect(nodesService.register).toHaveBeenCalledWith(dto, 'test-secret-value');

    await controller.heartbeat('n1', hb, 'test-secret-value');
    expect(nodesService.heartbeat).toHaveBeenCalledWith('n1', hb, 'test-secret-value');
  });
});
