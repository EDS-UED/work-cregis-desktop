import { resolveDemoAmountRowValues } from '@/scenes/shared/egDataListMockData';
import type { TransactionRecordRow } from './transactionRecordTypes';

export function parseRowIndexFromTransactionRecordId(id: string): number {
  const match = /^tx-(\d+)$/.exec(id.trim());
  if (!match) return 0;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : 0;
}

export function buildTransactionRecordAmountHeadline(row: TransactionRecordRow): string {
  const primary = `${row.amount} ${row.symbol}`.trim();
  const fiat =
    row.fiatAmount.trim()
    || resolveDemoAmountRowValues(parseRowIndexFromTransactionRecordId(row.id)).fiatValue.trim();
  if (!fiat || fiat === primary) return primary;
  return `${primary} ≈ ${fiat}`;
}
