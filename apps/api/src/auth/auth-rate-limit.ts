const WINDOW_MS = 60_000;
const LIMIT = 5;
const MAX_KEYS = 10_000;

export class AuthRateLimiter {
  private hits = new Map<string, number[]>();
  consume(ip: string, now = Date.now()): boolean {
    const windowStart = now - WINDOW_MS;
    const prev = this.hits.get(ip) ?? [];
    const next = prev.filter((t) => t > windowStart);
    if (next.length >= LIMIT) {
      this.hits.set(ip, next);
      return false;
    }
    for (const [k, ts] of this.hits) {
      if (ts.every((t) => t <= windowStart)) this.hits.delete(k);
    }
    if (!this.hits.has(ip) && this.hits.size >= MAX_KEYS) {
      let oldestKey: string | undefined;
      let oldest = Infinity;
      for (const [k, ts] of this.hits) {
        const last = ts[ts.length - 1] ?? 0;
        if (last < oldest) {
          oldest = last;
          oldestKey = k;
        }
      }
      if (oldestKey) this.hits.delete(oldestKey);
    }
    next.push(now);
    this.hits.set(ip, next);
    return true;
  }
}
