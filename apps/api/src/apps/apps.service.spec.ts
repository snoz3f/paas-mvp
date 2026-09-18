import { CryptoService } from '@/crypto/crypto.service';
import { AppsService } from './apps.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');
const PLAIN = 'test-secret-value';
const HOOK = 'webhook-secret-value';

describe('AppsService gitToken / webhookSecret at rest', () => {
  const origKey = process.env.ENCRYPTION_KEY;

  afterEach(() => {
    if (origKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = origKey;
  });

  it('encrypts gitToken on create and webhookSecret on register', async () => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    process.env.API_URL = 'https://api.infral.dev';
    const crypto = new CryptoService({} as never);
    const stored = { id: 'app-1', repoUrl: 'https://github.com/dev-user/node-api.git', gitToken: null };
    const prisma = {
      project: { findUnique: jest.fn().mockResolvedValue({ id: 'proj-1', userId: 'user-1' }) },
      app: {
        create: jest.fn().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
          ...stored,
          ...data,
        })),
        update: jest.fn().mockResolvedValue({}),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ ...stored, gitToken: 'enc:v1:x' }),
      },
    };
    const github = {
      getTokenForUser: jest.fn(),
      generateWebhookSecret: jest.fn().mockReturnValue(HOOK),
      registerWebhook: jest.fn().mockResolvedValue(42),
    };

    const service = new AppsService(prisma as never, github as never, crypto);
    await service.create('user-1', 'proj-1', {
      name: 'api',
      repoUrl: 'https://github.com/dev-user/node-api.git',
      framework: 'node',
      gitToken: PLAIN,
    });

    const created = prisma.app.create.mock.calls[0][0].data as { gitToken?: string };
    expect(created.gitToken).toBeDefined();
    expect(created.gitToken!.startsWith('enc:v1:')).toBe(true);
    expect(crypto.decrypt(created.gitToken!)).toBe(PLAIN);
    expect(github.registerWebhook).toHaveBeenCalledWith(
      'https://github.com/dev-user/node-api.git',
      PLAIN,
      HOOK,
      expect.stringContaining('/webhooks/github/'),
    );
    const hookData = prisma.app.update.mock.calls[0][0].data as { webhookSecret: string };
    expect(hookData.webhookSecret.startsWith('enc:v1:')).toBe(true);
    expect(crypto.decrypt(hookData.webhookSecret)).toBe(HOOK);
  });

  it('encrypts gitToken on update', async () => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    const crypto = new CryptoService({} as never);
    const prisma = {
      app: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'app-1',
          projectId: 'proj-1',
          gitToken: null,
          project: { userId: 'user-1' },
        }),
        update: jest.fn().mockResolvedValue({ id: 'app-1', gitToken: 'enc:v1:x' }),
      },
    };
    const service = new AppsService(prisma as never, {} as never, crypto);
    await service.update('user-1', 'proj-1', 'app-1', { gitToken: PLAIN });
    const data = prisma.app.update.mock.calls[0][0].data as { gitToken: string };
    expect(data.gitToken.startsWith('enc:v1:')).toBe(true);
    expect(crypto.decrypt(data.gitToken)).toBe(PLAIN);
  });
});

describe('AppsService.toSafe / remove', () => {
  const fixture = {
    id: 'app-1',
    projectId: 'proj-1',
    name: 'api',
    repoUrl: 'https://github.com/acme/app',
    rootDir: '.',
    domain: null,
    framework: 'node',
    port: 3000,
    envVars: {},
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ramMb: 512,
    cpuMilli: 500,
    diskGb: 5,
    gitToken: 'enc:v1:git-token-ciphertext',
    webhookSecret: 'enc:v1:webhook-secret-ciphertext',
    project: {
      id: 'proj-1',
      userId: 'user-1',
      name: 'proj',
      passwordHash: 'argon2-hash-must-not-leak',
    },
  };

  it('toSafe allowlist omits secrets, project, and passwordHash', () => {
    const service = new AppsService({} as never, {} as never, {} as never);
    const safe = (
      service as unknown as { toSafe(app: typeof fixture): Record<string, unknown> }
    ).toSafe(fixture);
    const json = JSON.stringify(safe);
    expect(json).not.toContain('enc:v1:git-token-ciphertext');
    expect(json).not.toContain('enc:v1:webhook-secret-ciphertext');
    expect(json).not.toContain('argon2-hash-must-not-leak');
    expect(json).not.toContain('"project"');
    expect(json).not.toContain('"gitToken"');
    expect(json).not.toContain('"webhookSecret"');
    expect(json).not.toContain('"passwordHash"');
    expect(safe.hasGitToken).toBe(true);
    expect(safe.id).toBe('app-1');
    expect(safe.rootDir).toBe('.');
  });

  it('remove returns undefined (no Prisma row body)', async () => {
    const prisma = {
      app: {
        findUnique: jest.fn().mockResolvedValue(fixture),
        delete: jest.fn().mockResolvedValue(fixture),
      },
    };
    const service = new AppsService(prisma as never, {} as never, {} as never);
    const result = await service.remove('user-1', 'proj-1', 'app-1');
    expect(result).toBeUndefined();
    expect(prisma.app.delete).toHaveBeenCalledWith({ where: { id: 'app-1' } });
  });

  it('create rejects unsafe rootDir', async () => {
    const prisma = {
      project: { findUnique: jest.fn().mockResolvedValue({ id: 'proj-1', userId: 'user-1' }) },
      app: { create: jest.fn() },
    };
    const service = new AppsService(prisma as never, { getTokenForUser: jest.fn() } as never, {
      encrypt: (v: string) => v,
    } as never);
    await expect(
      service.create('user-1', 'proj-1', {
        name: 'api',
        repoUrl: 'https://github.com/acme/app',
        framework: 'node',
        rootDir: '../etc',
      }),
    ).rejects.toThrow(/invalid rootDir/);
    expect(prisma.app.create).not.toHaveBeenCalled();
  });
});
