import { createHmac } from 'crypto';
import { IS_PUBLIC_KEY } from '@/auth/decorators/public.decorator';
import { CryptoService } from '@/crypto/crypto.service';
import { GithubService } from '@/github/github.service';
import { WebhooksController } from './webhooks.controller';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');
const PLAIN = 'test-secret-value';
const APP_ID = '11111111-1111-1111-1111-111111111111';

describe('WebhooksController HMAC decrypt', () => {
  const origKey = process.env.ENCRYPTION_KEY;

  afterEach(() => {
    if (origKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = origKey;
  });

  it('does not mark handleGithubPush as @Public()', () => {
    const meta = Reflect.getMetadata(IS_PUBLIC_KEY, WebhooksController.prototype.handleGithubPush);
    expect(meta).toBeUndefined();
    const classMeta = Reflect.getMetadata(IS_PUBLIC_KEY, WebhooksController);
    expect(classMeta).toBeUndefined();
  });

  it('decrypts webhookSecret before HMAC', async () => {
    process.env.ENCRYPTION_KEY = TEST_KEY;
    const crypto = new CryptoService({} as never);
    const encrypted = crypto.encrypt(PLAIN);
    const rawBody = Buffer.from('{"ref":"refs/heads/main"}');
    const signature = `sha256=${createHmac('sha256', PLAIN).update(rawBody).digest('hex')}`;

    const github = new GithubService({} as never, {} as never, crypto);
    const verify = jest.spyOn(github, 'verifySignature');
    const prisma = {
      app: { findUnique: jest.fn().mockResolvedValue({ id: APP_ID, webhookSecret: encrypted }) },
    };
    const deployments = { createFromWebhook: jest.fn() };
    const controller = new WebhooksController(
      github,
      prisma as never,
      deployments as never,
      crypto,
    );

    await expect(
      controller.handleGithubPush(
        APP_ID,
        signature,
        'ping',
        { rawBody } as never,
      ),
    ).resolves.toEqual({ ignored: true });

    expect(verify).toHaveBeenCalledWith(PLAIN, rawBody, signature);
    expect(verify.mock.calls[0][0]).not.toContain('enc:v1:');
  });
});
