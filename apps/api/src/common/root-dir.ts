import path from 'node:path';

export function assertSafeRootDir(rootDir: string | undefined): string {
  const raw = (rootDir ?? '.').replace(/\\/g, '/').trim() || '.';
  if (raw.includes('\0')) throw new Error('invalid rootDir');
  if (path.posix.isAbsolute(raw) || /^[a-zA-Z]:/.test(raw)) throw new Error('invalid rootDir');
  const normalized = path.posix.normalize(raw);
  if (normalized === '..' || normalized.startsWith('../') || normalized.split('/').includes('..')) {
    throw new Error('invalid rootDir');
  }
  return normalized === '' ? '.' : normalized;
}
