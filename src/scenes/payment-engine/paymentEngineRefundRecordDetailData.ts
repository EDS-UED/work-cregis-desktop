import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
  resolveShowcaseThenCompletedStatus,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineOrderRefundRecord,
  PaymentEngineOrderRefundStatus,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const REFUND_DETAIL_STATUS_SHOWCASE: readonly PaymentEngineOrderRefundStatus[] = [
  'pending',
  'success',
  'failed',
];

const REFUND_INITIATED_BY_SAMPLES = [
  'DJO Technology Co., Ltd.',
  'Merchant',
  'Aurora Merchant',
] as const;

const REFUND_REASON_KEY =
  'Others (eg. timeout, duplicate payment, incorrect payment currency, network delay, etc.)';

function parseDecimalAmount(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value: string): string {
  return formatGroupedDecimalAmount(value);
}

function buildRefundServiceFee(amount: string): string {
  const fee = parseDecimalAmount(amount) * 0.00002;
  return formatAmount(String(Math.max(fee, 0.00001)));
}

function resolveRefundDetailStatus(row: PaymentEngineRecordRow, rowIndex: number): PaymentEngineOrderRefundStatus {
  const fromRow = row.status;
  if (fromRow === 'pending' || fromRow === 'success' || fromRow === 'failed') {
    return fromRow;
  }
  return resolveShowcaseThenCompletedStatus(
    rowIndex,
    REFUND_DETAIL_STATUS_SHOWCASE,
    'success',
  );
}

function buildRefundRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineOrderRefundRecord {
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const networkLabel = row.currencyNetwork ?? row.networkLabel ?? '';
  const refundBase = formatAmount(row.orderAmount);
  const refundFee = buildRefundServiceFee(refundBase);
  const actualRefund = formatAmount(
    String(Math.max(parseDecimalAmount(refundBase) - parseDecimalAmount(refundFee), 0)),
  );
  const status = resolveRefundDetailStatus(row, rowIndex);
  const addressOffset = rowIndex + 4;
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);

  const detail: PaymentEngineOrderRefundRecord = {
    refundId: row.refundId ?? `RFD-${55001 + rowIndex}`,
    status,
    refundTypeKey: rowIndex % 3 === 0 ? 'Full refund' : 'Partial refund',
    refundReasonKey: REFUND_REASON_KEY,
    payerId: String(9527 + rowIndex),
    createdAt: row.createdAt,
    blockTimestamp: `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:23:00`,
    approvalTime: `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:23:00`,
    initiatedBy: REFUND_INITIATED_BY_SAMPLES[rowIndex % REFUND_INITIATED_BY_SAMPLES.length],
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
    senderAddress: row.walletFromAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    receiverAddress: row.walletToAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: row.walletToAlias ?? (rowIndex % 2 === 0 ? 'EverGreen' : ''),
    refundAmount: refundBase,
    refundSymbol: symbol,
    networkLabel,
    refundFee: `${refundFee} ${symbol}`,
    actualRefundAmount: `${actualRefund} ${symbol}`,
  };

  if (status === 'success') {
    const addressFamily = symbol === 'TON' ? 'ton' as const : 'evm';
    return {
      ...detail,
      blockEvent: detail.blockTimestamp,
      txHash: resolveVerifiedTxHashForRow(rowIndex + 52, addressFamily),
    };
  }

  return detail;
}

export function enrichPaymentRefundRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.refundRecordDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    refundRecordDetail: buildRefundRecordDetail(row, rowIndex),
  };
}

export function resolvePaymentRefundRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineOrderRefundRecord {
  const enriched = enrichPaymentRefundRecordForDetail(row);
  return enriched.refundRecordDetail ?? buildRefundRecordDetail(row, resolveEgDataListDemoRowIndex(row));
}
