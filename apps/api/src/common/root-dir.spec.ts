import { assertSafeRootDir } from './root-dir';

describe('assertSafeRootDir', () => {
  it.each(['.', 'apps/web', undefined])('accepts %j', (input) => {
    expect(() => assertSafeRootDir(input)).not.toThrow();
  });

  it('normalizes undefined and empty to .', () => {
    expect(assertSafeRootDir(undefined)).toBe('.');
    expect(assertSafeRootDir('')).toBe('.');
    expect(assertSafeRootDir('.')).toBe('.');
  });

  it('returns normalized relative path', () => {
    expect(assertSafeRootDir('apps/web')).toBe('apps/web');
  });

  it.each(['..', '../etc', '/etc', 'apps/../../etc', 'foo\0bar'])(
    'rejects %j',
    (input) => {
      expect(() => assertSafeRootDir(input)).toThrow(/invalid rootDir/);
    },
  );
});
