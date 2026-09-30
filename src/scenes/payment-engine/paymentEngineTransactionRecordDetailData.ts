import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineRecordRow,
  PaymentEngineTransactionRecordDetail,
} from './paymentEngineRecordConfigs';

const SUBMITTED_BY_SAMPLES = [
  'Ethan Davis',
  'Cregis Robot',
  'Merchant API',
] as const;

const MEMO_SAMPLES = [
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

function buildTransactionRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
  menuItem: string,
): PaymentEngineTransactionRecordDetail {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const addressOffset = rowIndex + 12;
  const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const showChainOutcome = menuItem === 'History' || menuItem === 'Processing';

  return {
    cregisId: row.id,
    thirdPartyBusinessNo: buildThirdPartyBusinessNo(rowIndex),
    submittedBy: SUBMITTED_BY_SAMPLES[rowIndex % SUBMITTED_BY_SAMPLES.length],
    createdAt: row.createdAt,
    senderAddress: row.walletFromAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    senderAlias: row.walletFromAlias,
    receiverAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias,
    txHash: showChainOutcome
      ? resolveVerifiedTxHashForRow(rowIndex + 61, addressFamily)
      : undefined,
    blockNumber: showChainOutcome ? buildBlockNumber(rowIndex) : undefined,
    minerFee: showChainOutcome ? buildMinerFeeDisplay(row.orderAmount, symbol) : undefined,
    completionTime: menuItem === 'History' ? buildCompletionTime(rowIndex) : undefined,
    memo: MEMO_SAMPLES[rowIndex % MEMO_SAMPLES.length],
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
  };
}

export function enrichPaymentTransactionRecordForDetail(
  row: PaymentEngineRecordRow,
  menuItem: string,
): PaymentEngineRecordRow {
  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    transactionRecordDetail: buildTransactionRecordDetail(row, rowIndex, menuItem),
  };
}

export function resolvePaymentTransactionRecordDetail(
  row: PaymentEngineRecordRow,
  menuItem: string,
): PaymentEngineTransactionRecordDetail {
  return buildTransactionRecordDetail(row, resolveEgDataListDemoRowIndex(row), menuItem);
}
