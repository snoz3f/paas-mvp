import { createHash } from 'crypto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { NodesService } from './nodes.service';

const TOKEN = 'test-secret-value';
const OTHER_TOKEN = 'other-secret-value';

function hash(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function mockPrisma() {
  return {
    node: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };
}

const dto = {
  name: 'worker-01',
  ip: '10.0.0.1',
  region: 'eu-west',
  provider: 'hetzner',
  totalRamMb: 8192,
  totalDiskGb: 80,
};

describe('NodesService.register', () => {
  const origNames = process.env.ALLOWED_NODE_NAMES;
  const origBind = process.env.ALLOW_NODE_FIRST_BIND;
  let prisma: ReturnType<typeof mockPrisma>;
  let service: NodesService;

  beforeEach(() => {
    prisma = mockPrisma();
    service = new NodesService(prisma as never);
    process.env.ALLOWED_NODE_NAMES = 'worker-01';
    delete process.env.ALLOW_NODE_FIRST_BIND;
  });

  afterEach(() => {
    if (origNames === undefined) delete process.env.ALLOWED_NODE_NAMES;
    else process.env.ALLOWED_NODE_NAMES = origNames;
    if (origBind === undefined) delete process.env.ALLOW_NODE_FIRST_BIND;
    else process.env.ALLOW_NODE_FIRST_BIND = origBind;
  });

  it('returns 401 when x-node-token is missing', async () => {
    await expect(service.register(dto, '')).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(service.register(dto, undefined as unknown as string)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.node.update).not.toHaveBeenCalled();
    expect(prisma.node.create).not.toHaveBeenCalled();
  });

  it('returns 403 when name is not in ALLOWED_NODE_NAMES', async () => {
    await expect(
      service.register({ ...dto, name: 'attacker-01' }, TOKEN),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.node.update).not.toHaveBeenCalled();
    expect(prisma.node.create).not.toHaveBeenCalled();
  });

  it('returns 401 on hash mismatch and does not change IP', async () => {
    const existing = {
      id: 'n1',
      name: 'worker-01',
      ip: '10.0.0.1',
      tokenHash: hash(TOKEN),
    };
    prisma.node.findUnique.mockResolvedValue(existing);
    prisma.node.findFirst.mockResolvedValue(existing);

    await expect(
      service.register({ ...dto, ip: '9.9.9.9' }, OTHER_TOKEN),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.node.update).not.toHaveBeenCalled();
    expect(prisma.node.create).not.toHaveBeenCalled();
  });

  it('updates IP when hash matches', async () => {
    const existing = {
      id: 'n1',
      name: 'worker-01',
      ip: '10.0.0.1',
      tokenHash: hash(TOKEN),
    };
    prisma.node.findUnique.mockResolvedValue(existing);
    prisma.node.findFirst.mockResolvedValue(existing);
    prisma.node.update.mockResolvedValue({ ...existing, ip: '10.0.0.2' });

    const result = await service.register({ ...dto, ip: '10.0.0.2' }, TOKEN);
    expect(result).toEqual({ nodeId: 'n1' });
    expect(prisma.node.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'n1' },
        data: expect.objectContaining({ ip: '10.0.0.2' }),
      }),
    );
  });

  it('returns 401 when tokenHash is null and ALLOW_NODE_FIRST_BIND is unset', async () => {
    const existing = {
      id: 'n1',
      name: 'worker-01',
      ip: '10.0.0.1',
      tokenHash: null,
    };
    prisma.node.findUnique.mockResolvedValue(existing);
    prisma.node.findFirst.mockResolvedValue(existing);

    await expect(service.register({ ...dto, ip: '9.9.9.9' }, TOKEN)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.node.update).not.toHaveBeenCalled();
    expect(prisma.node.create).not.toHaveBeenCalled();
  });

  it('returns 401 when no row and ALLOW_NODE_FIRST_BIND is unset', async () => {
    prisma.node.findUnique.mockResolvedValue(null);
    prisma.node.findFirst.mockResolvedValue(null);

    await expect(service.register(dto, TOKEN)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.node.create).not.toHaveBeenCalled();
  });

  it('first-binds when ALLOW_NODE_FIRST_BIND is true', async () => {
    process.env.ALLOW_NODE_FIRST_BIND = 'true';
    prisma.node.findUnique.mockResolvedValue(null);
    prisma.node.findFirst.mockResolvedValue(null);
    prisma.node.create.mockResolvedValue({ id: 'n-new', name: dto.name });

    const result = await service.register(dto, TOKEN);
    expect(result).toEqual({ nodeId: 'n-new' });
    expect(prisma.node.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'worker-01',
          ip: '10.0.0.1',
          tokenHash: hash(TOKEN),
        }),
      }),
    );
  });

  it('first-binds an existing null-hash row when flag is true', async () => {
    process.env.ALLOW_NODE_FIRST_BIND = 'true';
    const existing = {
      id: 'n1',
      name: 'worker-01',
      ip: '1.1.1.1',
      tokenHash: null,
    };
    prisma.node.findUnique.mockResolvedValue(existing);
    prisma.node.findFirst.mockResolvedValue(existing);
    prisma.node.update.mockResolvedValue({ ...existing, ip: dto.ip, tokenHash: hash(TOKEN) });

    const result = await service.register(dto, TOKEN);
    expect(result).toEqual({ nodeId: 'n1' });
    expect(prisma.node.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'n1' },
        data: expect.objectContaining({
          ip: '10.0.0.1',
          tokenHash: hash(TOKEN),
        }),
      }),
    );
  });
});

describe('NodesService.heartbeat', () => {
  let prisma: ReturnType<typeof mockPrisma>;
  let service: NodesService;

  beforeEach(() => {
    prisma = mockPrisma();
    service = new NodesService(prisma as never);
  });

  it('returns 401 when x-node-token is missing', async () => {
    await expect(
      service.heartbeat('n1', { cpuUsage: 1, ramUsage: 2, activeContainers: 0 }, ''),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.node.update).not.toHaveBeenCalled();
  });

  it('returns 401 on hash mismatch and does not write ip', async () => {
    prisma.node.findUnique.mockResolvedValue({
      id: 'n1',
      ip: '10.0.0.1',
      tokenHash: hash(TOKEN),
    });

    await expect(
      service.heartbeat('n1', { cpuUsage: 1, ramUsage: 2, activeContainers: 0 }, OTHER_TOKEN),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.node.update).not.toHaveBeenCalled();
  });

  it('enumerates heartbeat fields and never writes ip', async () => {
    prisma.node.findUnique.mockResolvedValue({
      id: 'n1',
      ip: '10.0.0.1',
      tokenHash: hash(TOKEN),
    });
    prisma.node.update.mockResolvedValue({});

    await service.heartbeat(
      'n1',
      { cpuUsage: 11, ramUsage: 22, activeContainers: 3, totalRamMb: 4096, totalDiskGb: 40 },
      TOKEN,
    );

    expect(prisma.node.update).toHaveBeenCalledTimes(1);
    const arg = prisma.node.update.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(arg.data).not.toHaveProperty('ip');
    expect(arg.data).toEqual(
      expect.objectContaining({
        cpuUsage: 11,
        ramUsage: 22,
        activeContainers: 3,
        totalRamMb: 4096,
        totalDiskGb: 40,
      }),
    );
  });
});

describe('NodesService.findAll / findOne', () => {
  it('JSON.stringify(findAll()) has no tokenHash key and no hex hash', async () => {
    const tokenHash = hash(TOKEN);
    const prisma = mockPrisma();
    const publicRow = {
      id: 'n1',
      name: 'worker-01',
      ip: '10.0.0.1',
      region: null,
      provider: null,
      status: 'ONLINE',
      cpuUsage: 0,
      ramUsage: 0,
      activeContainers: 0,
      lastHeartbeat: null,
      totalRamMb: 0,
      totalDiskGb: 0,
    };
    prisma.node.findMany.mockImplementation(async (args: { select?: Record<string, boolean> }) => {
      expect(args.select).toBeDefined();
      expect(args.select).not.toHaveProperty('tokenHash');
      return [publicRow];
    });
    prisma.node.findUnique.mockImplementation(async (args: { select?: Record<string, boolean> }) => {
      expect(args.select).toBeDefined();
      expect(args.select).not.toHaveProperty('tokenHash');
      return publicRow;
    });

    const service = new NodesService(prisma as never);
    const allJson = JSON.stringify(await service.findAll());
    expect(allJson).not.toContain('tokenHash');
    expect(allJson).not.toContain(tokenHash);

    const oneJson = JSON.stringify(await service.findOne('n1'));
    expect(oneJson).not.toContain('tokenHash');
    expect(oneJson).not.toContain(tokenHash);
  });
});
