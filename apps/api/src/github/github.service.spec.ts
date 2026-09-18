import { createHmac } from 'crypto';
import { CryptoService } from '@/crypto/crypto.service';
import { GithubService } from './github.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');

describe('GithubService.verifySignature', () => {
  const service = new GithubService({} as never, {} as never, {} as never);
  const secret = 'test-secret-value';
  const payload = Buffer.from('{"ref":"refs/heads/main"}');
  const valid = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;

  it('accepts the right signature', () => {
    expect(service.verifySignature(secret, payload, valid)).toBe(true);
  });

  it('rejects a wrong signature', () => {
    expect(service.verifySignature(secret, payload, `sha256=${'ab'.repeat(32)}`)).toBe(false);
  });

  it('rejects a truncated signature', () => {
    expect(service.verifySignature(secret, payload, valid.slice(0, -2))).toBe(false);
  });
});

describe('GithubService token encrypt/decrypt', () => {
  const origKey = process.env.ENCRYPTION_KEY;
  let prisma: {
    user: { findUnique: jest.Mock; findUniqueOrThrow: jest.Mock; update: jest.Mock };
  };
  let crypto: CryptoService;
  let service: GithubService;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    crypto = new CryptoService({} as never);
    prisma = {
      user: {
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    service = new GithubService(prisma as never, {} as never, crypto);
  });

  afterEach(() => {
    if (origKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = origKey;
    jest.restoreAllMocks();
  });

  it('encrypts githubAccessToken on mockConnect', async () => {
    await service.mockConnect('user-1');
    const stored = prisma.user.update.mock.calls[0][0].data.githubAccessToken as string;
    expect(stored.startsWith('enc:v1:')).toBe(true);
    expect(crypto.decrypt(stored)).toBe('mock');
  });

  it('returns decrypted token from getTokenForUser', async () => {
    prisma.user.findUnique.mockResolvedValue({
      githubAccessToken: crypto.encrypt('test-secret-value'),
    });
    await expect(service.getTokenForUser('user-1')).resolves.toBe('test-secret-value');
  });

  it('checks mock after decrypt, not against ciphertext', async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      githubAccessToken: crypto.encrypt('mock'),
    });
    const fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('should not fetch'));
    const repos = await service.getRepos('user-1');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(repos[0]?.fullName).toBe('dev-user/node-api');
  });
});

