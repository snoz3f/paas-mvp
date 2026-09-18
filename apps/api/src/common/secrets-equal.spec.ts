import { secretsEqual } from './secrets-equal';

describe('secretsEqual', () => {
  it('rejects undefined expected (fail-closed)', () => {
    expect(secretsEqual('test-secret-value', undefined)).toBe(false);
    expect(secretsEqual(undefined, undefined)).toBe(false);
  });

  it('rejects missing/array header', () => {
    expect(secretsEqual(undefined, 'test-secret-value')).toBe(false);
    expect(secretsEqual(['test-secret-value'], 'test-secret-value')).toBe(false);
  });

  it('rejects different lengths without throwing', () => {
    expect(secretsEqual('short', 'test-secret-value')).toBe(false);
  });

  it('accepts equal strings', () => {
    expect(secretsEqual('test-secret-value', 'test-secret-value')).toBe(true);
  });
});
