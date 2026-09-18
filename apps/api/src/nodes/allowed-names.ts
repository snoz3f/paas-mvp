export function parseAllowedNodeNames(raw: string | undefined): string[] {
  const s = (raw ?? '').trim();
  if (s === '') return ['worker-01'];
  if (s.toLowerCase() === 'none') return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}
