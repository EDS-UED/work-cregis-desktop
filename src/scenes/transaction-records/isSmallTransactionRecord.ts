import type { TransactionRecordRow } from './transactionRecordTypes';

/** Fiat USD threshold used when “Hide small transactions” is enabled. */
export const SMALL_TRANSACTION_FIAT_THRESHOLD = 100;

export function parseTransactionRecordFiatAmount(fiatAmount: string): number {
  const normalized = fiatAmount.replace(/[^0-9.-]/g, '');
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function isSmallTransactionRecord(row: TransactionRecordRow): boolean {
  return parseTransactionRecordFiatAmount(row.fiatAmount) < SMALL_TRANSACTION_FIAT_THRESHOLD;
}
