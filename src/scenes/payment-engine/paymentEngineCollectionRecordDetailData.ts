import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineCollectionRecordDetail,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const SUBMITTED_BY_SAMPLES = [
  'Ethan Davis',
  'Cregis Robot',
  'Merchant API',
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

function shouldShowCollectionChainOutcome(
  row: PaymentEngineRecordRow,
  menuItem: string,
): boolean {
  if (menuItem === 'Collection History') {
    return row.status === 'success';
  }
  if (menuItem === 'Collection Processing') {
    return row.status === 'success' || row.status === 'completed';
  }
  return false;
}

function shouldShowCollectionCompletionTime(
  row: PaymentEngineRecordRow,
  menuItem: string,
): boolean {
  if (menuItem === 'Collection Processing') {
    return false;
  }
  return shouldShowCollectionChainOutcome(row, menuItem);
}

function buildCollectionRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
  menuItem: string,
): PaymentEngineCollectionRecordDetail {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const addressOffset = rowIndex + 18;
  const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const showChainOutcome = shouldShowCollectionChainOutcome(row, menuItem);

  return {
    businessTypeKey: row.businessTypeKey ?? 'Collection',
    submittedBy: SUBMITTED_BY_SAMPLES[rowIndex % SUBMITTED_BY_SAMPLES.length],
    collectionNumber: row.collectionId ?? row.id,
    startTime: row.createdAt,
    senderAddress: row.walletFromAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    senderAlias: row.walletFromAlias,
    receiverAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias,
    txHash: showChainOutcome
      ? resolveVerifiedTxHashForRow(rowIndex + 95, addressFamily)
      : undefined,
    minerFee: showChainOutcome ? buildMinerFeeDisplay(row.orderAmount, symbol) : undefined,
    completionTime: shouldShowCollectionCompletionTime(row, menuItem)
      ? (row.completionTime ?? row.createdAt)
      : undefined,
  };
}

export function enrichPaymentCollectionRecordForDetail(
  row: PaymentEngineRecordRow,
  menuItem: string,
): PaymentEngineRecordRow {
  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    collectionRecordDetail: buildCollectionRecordDetail(row, rowIndex, menuItem),
  };
}

export function resolvePaymentCollectionRecordDetail(
  row: PaymentEngineRecordRow,
  menuItem: string,
): PaymentEngineCollectionRecordDetail {
  return buildCollectionRecordDetail(row, resolveEgDataListDemoRowIndex(row), menuItem);
}
