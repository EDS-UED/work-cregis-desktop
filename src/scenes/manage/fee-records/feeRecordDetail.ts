export function parseRowIndexFromFeeRecordId(id: string): number {
  const match = /^fee-(\d+)$/.exec(String(id).trim());
  if (!match) return 0;
  const parsed = Number.parseInt(match[1] ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed - 1;
}
