import { CryptoService } from '@/crypto/crypto.service';
import { DeploymentsService } from './deployments.service';
import type { WorkerJob, WorkerNode } from '@/worker-client/worker-client.interfaces';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');
const PLAIN = 'test-secret-value';

describe('DeploymentsService clone URL', () => {
  const origKey = process.env.ENCRYPTION_KEY;
  const origApi = process.env.API_INTERNAL_URL;

  afterEach(() => {
    if (origKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = origKey;
    if (origApi === undefined) delete process.env.API_INTERNAL_URL;
    else process.env.API_INTERNAL_URL = origApi;
  });

  it('does not put enc:v1: into the worker clone URL', async () => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    process.env.API_INTERNAL_URL = 'http://api:5001';
    const crypto = new CryptoService({} as never);
    const encrypted = crypto.encrypt(PLAIN);
    expect(encrypted.startsWith('enc:v1:')).toBe(true);

    const app = {
      id: 'app-1',
      projectId: 'proj-1',
      repoUrl: 'https://github.com/dev-user/node-api.git',
      gitToken: encrypted,
      rootDir: '.',
      port: 3000,
      domain: null,
      envVars: {},
      ramMb: 512,
      cpuMilli: 500,
      project: { userId: 'user-1' },
    };
    const prisma = {
      app: {
        findUnique: jest.fn().mockResolvedValue(app),
        findUniqueOrThrow: jest.fn().mockResolvedValue(app),
      },
      deployment: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'dep-1' }),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const scheduler = {
      selectNode: jest.fn().mockResolvedValue({ id: 'n1', ip: 'worker' }),
    };
    const workerClient = { sendJob: jest.fn() };
    const sent = new Promise<[WorkerNode, WorkerJob]>((resolve) => {
      workerClient.sendJob.mockImplementation(async (node: WorkerNode, job: WorkerJob) => {
        resolve([node, job]);
      });
    });

    const service = new DeploymentsService(
      prisma as never,
      scheduler as never,
      workerClient as never,
      crypto,
    );
    await service.create('user-1', 'proj-1', 'app-1');
    const [, job] = await sent;

    expect(job.repoUrl).toBeDefined();
    expect(job.repoUrl).not.toContain('enc:v1:');
    expect(job.repoUrl).toContain(PLAIN);
    expect(job.repoUrl).toContain('x-access-token');
  });

  it('does not send domain in the worker job', async () => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    process.env.API_INTERNAL_URL = 'http://api:5001';
    const crypto = new CryptoService({} as never);
    const app = {
      id: 'app-1',
      projectId: 'proj-1',
      repoUrl: 'https://github.com/dev-user/node-api.git',
      gitToken: null,
      rootDir: '.',
      port: 3000,
      domain: 'api.infral.dev',
      envVars: {},
      ramMb: 512,
      cpuMilli: 500,
      project: { userId: 'user-1' },
    };
    const prisma = {
      app: {
        findUnique: jest.fn().mockResolvedValue(app),
        findUniqueOrThrow: jest.fn().mockResolvedValue(app),
      },
      deployment: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'dep-1' }),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const scheduler = {
      selectNode: jest.fn().mockResolvedValue({ id: 'n1', ip: 'worker' }),
    };
    const workerClient = { sendJob: jest.fn() };
    const sent = new Promise<[WorkerNode, WorkerJob]>((resolve) => {
      workerClient.sendJob.mockImplementation(async (node: WorkerNode, job: WorkerJob) => {
        resolve([node, job]);
      });
    });

    const service = new DeploymentsService(
      prisma as never,
      scheduler as never,
      workerClient as never,
      crypto,
    );
    await service.create('user-1', 'proj-1', 'app-1');
    const [, job] = await sent;

    expect(job).not.toHaveProperty('domain');
  });
});
