import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEnginePaymentExceptionDetailRecord,
  PaymentEnginePaymentExceptionTransferApprovalStatus,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const FILTERED_REASON_KEY =
  'Others (eg. timeout, duplicate payment, incorrect payment currency, network delay, etc.)';

const INITIATED_BY_SAMPLES = [
  'DJO Technology Co., Ltd.',
  'Merchant',
  'Aurora Merchant',
] as const;

function parseDecimalAmount(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value: string): string {
  return formatGroupedDecimalAmount(value);
}

function buildTransferServiceFee(amount: string): string {
  const fee = parseDecimalAmount(amount) * 0.00002;
  return formatAmount(String(Math.max(fee, 0.00001)));
}

function buildPaymentExceptionId(rowIndex: number): string {
  const part1 = String(20_311_020 + rowIndex);
  const part2 = String(82_420_678 + rowIndex * 3);
  return `Number_${part1}_${part2}`;
}

function resolveTransferApprovalStatus(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEnginePaymentExceptionTransferApprovalStatus {
  if (row.status === 'pending') {
    return 'refunding';
  }

  if (row.status === 'transferred' || row.status === 'success') {
    return rowIndex % 4 === 0 ? 'refunding' : 'transferred';
  }

  return 'failed';
}

function buildPaymentExceptionRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEnginePaymentExceptionDetailRecord {
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const networkLabel = row.currencyNetwork ?? row.networkLabel ?? '';
  const transferBase = formatAmount(row.orderAmount);
  const transferFee = buildTransferServiceFee(transferBase);
  const actualTransferred = formatAmount(
    String(Math.max(parseDecimalAmount(transferBase) - parseDecimalAmount(transferFee), 0)),
  );
  const addressOffset = rowIndex + 6;
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const transferApprovalStatus = resolveTransferApprovalStatus(row, rowIndex);
  const blockTimestamp = `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:23:00`;

  const detail: PaymentEnginePaymentExceptionDetailRecord = {
    exceptionId: buildPaymentExceptionId(rowIndex),
    filteredReasonKey: FILTERED_REASON_KEY,
    transferApprovalStatus,
    initiatedBy: INITIATED_BY_SAMPLES[rowIndex % INITIATED_BY_SAMPLES.length],
    createdAt: row.createdAt,
    blockTimestamp,
    senderAddress: row.walletFromAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    receiverAddress: row.walletToAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias ?? (rowIndex % 2 === 0 ? 'EverGreen' : ''),
    transferSymbol: symbol,
    networkLabel,
    transferFee: `${transferFee} ${symbol}`,
    actualTransferredAmount: `${actualTransferred} ${symbol}`,
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
  };

  if (row.status === 'transferred' || row.status === 'success' || transferApprovalStatus === 'transferred') {
    const addressFamily = symbol === 'TON' ? 'ton' as const : 'evm';
    return {
      ...detail,
      txHash: resolveVerifiedTxHashForRow(rowIndex + 61, addressFamily),
    };
  }

  return detail;
}

export function enrichPaymentExceptionRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.paymentExceptionRecordDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    paymentExceptionRecordDetail: buildPaymentExceptionRecordDetail(row, rowIndex),
  };
}

export function resolvePaymentExceptionRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEnginePaymentExceptionDetailRecord {
  const enriched = enrichPaymentExceptionRecordForDetail(row);
  return enriched.paymentExceptionRecordDetail
    ?? buildPaymentExceptionRecordDetail(row, resolveEgDataListDemoRowIndex(row));
}
