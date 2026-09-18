import { effectiveRole } from './effective-role';

describe('effectiveRole', () => {
  it('returns admin when email is in ADMIN_EMAILS', () => {
    expect(effectiveRole('ops@example.com', 'ops@example.com')).toBe('admin');
    expect(effectiveRole('OPS@example.com', 'ops@example.com, other@x.com')).toBe('admin');
    expect(effectiveRole('ops@example.com', '  ops@example.com  ,a@b.c')).toBe('admin');
  });

  it('returns user when email is not in ADMIN_EMAILS', () => {
    expect(effectiveRole('user@example.com', 'ops@example.com')).toBe('user');
  });

  it('returns user when env is empty/undefined regardless of caller intent', () => {
    expect(effectiveRole('ops@example.com', undefined)).toBe('user');
    expect(effectiveRole('ops@example.com', '')).toBe('user');
    expect(effectiveRole('ops@example.com', '   ')).toBe('user');
    expect(effectiveRole('admin@example.com', ',,,')).toBe('user');
  });
});
