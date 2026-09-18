import { secretsEqual } from './secrets-equal';

describe('secretsEqual', () => {
  it('rejects undefined vs undefined', () => {
    expect(secretsEqual(undefined, undefined)).toBe(false);
  });
  it('rejects missing given', () => {
    expect(secretsEqual(undefined, 'secret')).toBe(false);
  });
  it('rejects empty expected', () => {
    expect(secretsEqual('secret', '')).toBe(false);
    expect(secretsEqual('secret', undefined)).toBe(false);
  });
  it('rejects different lengths without throwing', () => {
    expect(secretsEqual('ab', 'abcd')).toBe(false);
  });
  it('accepts equal strings', () => {
    expect(secretsEqual('same-secret', 'same-secret')).toBe(true);
  });
});
