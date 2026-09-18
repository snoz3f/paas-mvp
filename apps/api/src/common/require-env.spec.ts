import { requireEnv } from './require-env';

describe('requireEnv', () => {
  const key = 'TEST_REQUIRE_ENV';
  afterEach(() => { delete process.env[key]; });

  it('throws on missing, empty, or whitespace', () => {
    delete process.env[key];
    expect(() => requireEnv(key)).toThrow(/TEST_REQUIRE_ENV is required/);
    process.env[key] = '   ';
    expect(() => requireEnv(key)).toThrow(/TEST_REQUIRE_ENV is required/);
  });

  it('returns trimmed and writes back process.env', () => {
    process.env[key] = '  test-secret-value  ';
    expect(requireEnv(key)).toBe('test-secret-value');
    expect(process.env[key]).toBe('test-secret-value');
  });
});
