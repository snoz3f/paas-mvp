export type UserRoleName = 'user' | 'admin';

export function effectiveRole(email: string, env = process.env.ADMIN_EMAILS): UserRoleName {
  const allow = (env ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase()) ? 'admin' : 'user';
}
