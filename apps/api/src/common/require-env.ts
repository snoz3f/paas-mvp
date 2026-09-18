export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`${name} is required`);
  }
  const trimmed = value.trim();
  process.env[name] = trimmed;
  return trimmed;
}
