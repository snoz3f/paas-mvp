import type { AppFramework } from '@api/trpc/app-router';

export const FRAMEWORK_OPTIONS: { value: AppFramework; label: string }[] = [
  { value: 'static', label: 'Static' },
  { value: 'node', label: 'Node' },
  { value: 'python', label: 'Python' },
];

export function frameworkLabel(framework: AppFramework | null): string {
  if (!framework) return '—';
  return FRAMEWORK_OPTIONS.find((o) => o.value === framework)?.label ?? '—';
}
