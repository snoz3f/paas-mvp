export function internalCallbackUrl(path: string): string {
  const base = process.env.API_INTERNAL_URL ?? process.env.API_URL;
  if (!base) throw new Error('API_INTERNAL_URL or API_URL is required');
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
