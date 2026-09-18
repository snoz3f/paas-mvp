import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

function fakeContext(opts: {
  path?: string;
  authorization?: string;
  query?: Record<string, unknown>;
}): ExecutionContext {
  const request: Record<string, unknown> = {
    path: opts.path ?? '/projects/p/apps/a/deployments/d/logs',
    headers: opts.authorization
      ? { authorization: opts.authorization }
      : {},
    query: opts.query ?? {},
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}

describe('AuthGuard', () => {
  const jwtService = {
    verifyAsync: jest.fn(),
  };
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  };
  const guard = new AuthGuard(
    jwtService as unknown as JwtService,
    reflector as unknown as Reflector,
  );

  beforeEach(() => {
    jwtService.verifyAsync.mockReset();
    reflector.getAllAndOverride.mockReset();
    reflector.getAllAndOverride.mockReturnValue(false);
  });

  it('rejects request that only provides ?token= (no Bearer)', async () => {
    // Assert absence of query-token auth: only ?token= must be 401.
    await expect(
      guard.canActivate(
        fakeContext({ query: { token: 'jwt-from-query' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('accepts Authorization Bearer and attaches user', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'u@example.com',
    });
    const ctx = fakeContext({
      authorization: 'Bearer good-jwt',
    });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('good-jwt');
    const req = ctx.switchToHttp().getRequest<Record<string, unknown>>();
    expect(req['user']).toEqual({ sub: 'user-1', email: 'u@example.com' });
  });

  it('rejects missing auth entirely', async () => {
    await expect(guard.canActivate(fakeContext({}))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
