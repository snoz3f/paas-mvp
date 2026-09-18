import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { WorkerAuthGuard } from './worker-auth.guard';

function fakeContext(secret: string | string[] | undefined): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { 'x-worker-secret': secret },
      }),
    }),
  } as ExecutionContext;
}

describe('WorkerAuthGuard', () => {
  const orig = process.env.WORKER_SECRET;
  const guard = new WorkerAuthGuard();

  afterEach(() => {
    if (orig === undefined) {
      delete process.env.WORKER_SECRET;
    } else {
      process.env.WORKER_SECRET = orig;
    }
  });

  it('throws when header and env are both undefined', () => {
    delete process.env.WORKER_SECRET;
    expect(() => guard.canActivate(fakeContext(undefined))).toThrow(UnauthorizedException);
  });

  it('throws when header is set but env is empty', () => {
    process.env.WORKER_SECRET = '';
    expect(() => guard.canActivate(fakeContext('test-secret-value'))).toThrow(
      UnauthorizedException,
    );
  });

  it('throws when header does not match env', () => {
    process.env.WORKER_SECRET = 'test-secret-value';
    expect(() => guard.canActivate(fakeContext('other-secret-value'))).toThrow(
      UnauthorizedException,
    );
  });

  it('returns true when header matches env', () => {
    process.env.WORKER_SECRET = 'test-secret-value';
    expect(guard.canActivate(fakeContext('test-secret-value'))).toBe(true);
  });
});
