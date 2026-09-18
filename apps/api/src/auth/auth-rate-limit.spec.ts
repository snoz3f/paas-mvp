import { AuthRateLimiter } from './auth-rate-limit';

describe('AuthRateLimiter', () => {
  const now = 1_700_000_000_000;

  it('allows 5 hits in 60s and rejects the 6th', () => {
    const limiter = new AuthRateLimiter();
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume('10.0.0.1', now + i)).toBe(true);
    }
    expect(limiter.consume('10.0.0.1', now + 5)).toBe(false);
  });

  it('allows a hit after the 60s window', () => {
    const limiter = new AuthRateLimiter();
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume('10.0.0.1', now + i)).toBe(true);
    }
    expect(limiter.consume('10.0.0.1', now + 5)).toBe(false);
    expect(limiter.consume('10.0.0.1', now + 5 + 60_000)).toBe(true);
  });

  it('keys by IP, not email', () => {
    const limiter = new AuthRateLimiter();
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume('10.0.0.1', now)).toBe(true);
    }
    expect(limiter.consume('10.0.0.1', now)).toBe(false);
    expect(limiter.consume('10.0.0.2', now)).toBe(true);
  });

  it('does not give a forged X-Forwarded-For its own bucket when the code only sees req.ip', () => {
    const limiter = new AuthRateLimiter();
    const req = {
      ip: '10.0.0.5',
      headers: { 'x-forwarded-for': '203.0.113.9' },
    };
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume(req.ip, now)).toBe(true);
    }
    expect(limiter.consume(req.ip, now)).toBe(false);
    expect(limiter.consume(req.headers['x-forwarded-for'], now)).toBe(true);
  });

  it('evicts the oldest key at MAX_KEYS instead of 429ing a new IP', () => {
    const limiter = new AuthRateLimiter();
    for (let i = 0; i < 10_000; i++) {
      expect(limiter.consume(`10.0.${i}`, now + i)).toBe(true);
    }
    expect(limiter.consume('203.0.113.9', now + 10_000)).toBe(true);
  });
});
