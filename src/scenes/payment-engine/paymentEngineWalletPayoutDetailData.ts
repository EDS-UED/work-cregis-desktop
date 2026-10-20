import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineRecordRow,
  PaymentEngineWalletPayoutDetailRecord,
} from './paymentEngineRecordConfigs';

const WALLET_PAYOUT_WALLET_NAMES = [
  'Treasury',
  'Cold Wallet',
  'Hot Wallet',
  'Ops Pool',
] as const;

export function resolveWalletPayoutAffiliatedWalletName(rowIndex: number): string {
  return WALLET_PAYOUT_WALLET_NAMES[rowIndex % WALLET_PAYOUT_WALLET_NAMES.length]!;
}

const WALLET_PAYOUT_IP_SAMPLES = [
  'Washington, D.C. 192.168.1.230',
  'Singapore 203.0.113.42',
  'Frankfurt 198.51.100.18',
] as const;

const WALLET_PAYOUT_MEMO_SAMPLES = [
  'FJ859UF8F8',
  'INV-202712',
  'PAY-88421',
] as const;

function buildThirdPartyBusinessNo(rowIndex: number): string {
  return `Coinbase_order_${800_389_028 + rowIndex}`;
}

function parseDecimalAmount(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildMinerFeeDisplay(amount: string, symbol: string): string {
  const fee = parseDecimalAmount(amount) * 0.00002;
  const formatted = formatGroupedDecimalAmount(String(Math.max(fee, 0.00001)));
  return `${formatted} ${symbol}`.trim();
}

function buildBlockNumber(rowIndex: number): string {
  return String(482_016 + rowIndex * 137).padStart(6, '0').slice(-6);
}

function buildCompletionTime(rowIndex: number): string {
  return `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:24:18`;
}

function buildWalletPayoutDetailRecord(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineWalletPayoutDetailRecord {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const addressOffset = rowIndex + 9;
  const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const isCompleted = row.status === 'completed';

  return {
    walletName: WALLET_PAYOUT_WALLET_NAMES[rowIndex % WALLET_PAYOUT_WALLET_NAMES.length],
    thirdPartyBusinessNo: buildThirdPartyBusinessNo(rowIndex),
    initiationTime: row.createdAt,
    senderAddress: row.walletFromAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    senderAlias: row.walletFromAlias,
    receiverAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias,
    txHash: isCompleted
      ? resolveVerifiedTxHashForRow(rowIndex + 73, addressFamily)
      : undefined,
    blockNumber: isCompleted ? buildBlockNumber(rowIndex) : undefined,
    minerFee: isCompleted ? buildMinerFeeDisplay(row.orderAmount, symbol) : undefined,
    completionTime: isCompleted ? buildCompletionTime(rowIndex) : undefined,
    callbackAddress: row.callbackUrl ?? 'https://www.cregis.com/callback',
    ipAddress: WALLET_PAYOUT_IP_SAMPLES[rowIndex % WALLET_PAYOUT_IP_SAMPLES.length],
    memo: WALLET_PAYOUT_MEMO_SAMPLES[rowIndex % WALLET_PAYOUT_MEMO_SAMPLES.length],
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
  };
}

export function enrichPaymentWalletPayoutRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.walletPayoutDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    walletPayoutDetail: buildWalletPayoutDetailRecord(row, rowIndex),
  };
}

export function resolvePaymentWalletPayoutRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineWalletPayoutDetailRecord {
  const enriched = enrichPaymentWalletPayoutRecordForDetail(row);
  return enriched.walletPayoutDetail
    ?? buildWalletPayoutDetailRecord(row, resolveEgDataListDemoRowIndex(row));
}
