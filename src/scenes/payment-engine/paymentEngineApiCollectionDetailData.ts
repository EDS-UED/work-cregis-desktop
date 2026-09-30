import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineApiCollectionDetailRecord,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const API_COLLECTION_IP_SAMPLES = [
  'Washington, D.C. 192.168.1.230',
  'Singapore 203.0.113.42',
  'Frankfurt 198.51.100.18',
] as const;

function parseDecimalAmount(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildMinerFeeDisplay(amount: string, symbol: string): string {
  const fee = parseDecimalAmount(amount) * 0.00002;
  const formatted = formatGroupedDecimalAmount(String(Math.max(fee, 0.00001)));
  return `${formatted} ${symbol}`.trim();
}

function buildCompletionTime(rowIndex: number): string {
  return `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:24:18`;
}

function buildApiCollectionDetailRecord(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineApiCollectionDetailRecord {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const addressOffset = rowIndex + 15;
  const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const isCompleted = row.status === 'completed';

  return {
    ipAddress: API_COLLECTION_IP_SAMPLES[rowIndex % API_COLLECTION_IP_SAMPLES.length],
    createdAt: row.createdAt,
    senderAddress: row.walletFromAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    senderAlias: row.walletFromAlias,
    receiverAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias,
    txHash: isCompleted
      ? resolveVerifiedTxHashForRow(rowIndex + 81, addressFamily)
      : undefined,
    minerFee: isCompleted ? buildMinerFeeDisplay(row.orderAmount, symbol) : undefined,
    completionTime: isCompleted ? buildCompletionTime(rowIndex) : undefined,
  };
}

export function enrichPaymentApiCollectionRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.apiCollectionDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    apiCollectionDetail: buildApiCollectionDetailRecord(row, rowIndex),
  };
}

export function resolvePaymentApiCollectionRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineApiCollectionDetailRecord {
  const enriched = enrichPaymentApiCollectionRecordForDetail(row);
  return enriched.apiCollectionDetail
    ?? buildApiCollectionDetailRecord(row, resolveEgDataListDemoRowIndex(row));
}
