import { createHmac } from 'crypto';
import { GithubService } from './github.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('GithubService.verifySignature', () => {
  const service = new GithubService({} as never, {} as never);
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
