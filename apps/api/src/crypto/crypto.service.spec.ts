import { Logger } from '@nestjs/common';
import { CryptoService } from './crypto.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');
const OTHER_KEY = Buffer.alloc(32, 9).toString('base64');
const PLAIN = 'test-secret-value';

function mockPrisma() {
  return {
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    },
    app: {
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    },
  };
}

describe('CryptoService', () => {
  const origKey = process.env.ENCRYPTION_KEY;
  let prisma: ReturnType<typeof mockPrisma>;
  let crypto: CryptoService;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    prisma = mockPrisma();
    crypto = new CryptoService(prisma as never);
  });

  afterEach(() => {
    if (origKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = origKey;
  });

  it('throws when ENCRYPTION_KEY does not decode to 32 bytes', () => {
    process.env.ENCRYPTION_KEY = Buffer.alloc(16, 7).toString('base64');
    expect(() => new CryptoService(prisma as never)).toThrow(/ENCRYPTION_KEY/);
  });

  it('round-trips AES-256-GCM as enc:v1: + base64(iv||tag||ciphertext)', () => {
    const encrypted = crypto.encrypt(PLAIN);
    expect(encrypted.startsWith('enc:v1:')).toBe(true);
    const blob = Buffer.from(encrypted.slice('enc:v1:'.length), 'base64');
    expect(blob.length).toBe(12 + 16 + Buffer.byteLength(PLAIN, 'utf8'));
    expect(crypto.decrypt(encrypted)).toBe(PLAIN);
    expect(crypto.encrypt(PLAIN)).not.toBe(encrypted);
  });

  it('returns plaintext without prefix as-is', () => {
    expect(crypto.decrypt(PLAIN)).toBe(PLAIN);
    expect(crypto.decrypt('mock')).toBe('mock');
    expect(crypto.decrypt(null)).toBeNull();
    expect(crypto.decrypt(undefined)).toBeNull();
    expect(crypto.decrypt('')).toBe('');
  });

  it('throws on wrong key and never returns ciphertext as a token', () => {
    const encrypted = crypto.encrypt(PLAIN);
    process.env.ENCRYPTION_KEY = OTHER_KEY;
    const other = new CryptoService(prisma as never);
    expect(() => other.decrypt(encrypted)).toThrow();
    expect(encrypted.startsWith('enc:v1:')).toBe(true);
  });

  it('throws on short or tampered enc:v1: payload', () => {
    expect(() => crypto.decrypt('enc:v1:AAAA')).toThrow();
    const encrypted = crypto.encrypt(PLAIN);
    const blob = Buffer.from(encrypted.slice('enc:v1:'.length), 'base64');
    blob[blob.length - 1] ^= 0xff;
    const tampered = `enc:v1:${blob.toString('base64')}`;
    expect(() => crypto.decrypt(tampered)).toThrow();
  });

  it('onModuleInit encrypts plaintext rows, skips enc:v1:, logs counts not values', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    prisma.user.findMany.mockResolvedValue([
      { id: 'u1', githubAccessToken: PLAIN },
      { id: 'u2', githubAccessToken: 'enc:v1:already' },
    ]);
    prisma.app.findMany
      .mockResolvedValueOnce([{ id: 'a1', gitToken: PLAIN }])
      .mockResolvedValueOnce([{ id: 'a1', webhookSecret: PLAIN }]);

    await crypto.onModuleInit();

    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    const userData = prisma.user.update.mock.calls[0][0].data.githubAccessToken as string;
    expect(userData.startsWith('enc:v1:')).toBe(true);
    expect(crypto.decrypt(userData)).toBe(PLAIN);

    expect(prisma.app.update).toHaveBeenCalledTimes(2);
    const gitStored = prisma.app.update.mock.calls[0][0].data.gitToken as string;
    const hookStored = prisma.app.update.mock.calls[1][0].data.webhookSecret as string;
    expect(gitStored.startsWith('enc:v1:')).toBe(true);
    expect(hookStored.startsWith('enc:v1:')).toBe(true);

    const logged = log.mock.calls.map((c) => String(c[0])).join('\n');
    expect(logged).toMatch(/encrypted 1 github tokens, 1 gitTokens, 1 webhookSecrets/);
    expect(logged).not.toContain(PLAIN);
    log.mockRestore();
  });

  it('onModuleInit aborts when one row fails', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'u1', githubAccessToken: PLAIN }]);
    prisma.user.update.mockRejectedValue(new Error('db down'));
    await expect(crypto.onModuleInit()).rejects.toThrow('db down');
    expect(prisma.app.findMany).not.toHaveBeenCalled();
  });
});
