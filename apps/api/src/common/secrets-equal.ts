import { timingSafeEqual } from 'crypto';

export function secretsEqual(
  given: string | string[] | undefined,
  expected: string | undefined,
): boolean {
  if (typeof given !== 'string' || !expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
