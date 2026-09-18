import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import type {
  PaymentEngineCallbackErrorDetailRecord,
  PaymentEngineOrderStatus,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const FILTERED_REASON_KEY =
  'Others (eg. timeout, duplicate payment, incorrect payment currency, network delay, etc.)';

const CALLBACK_ABNORMAL_REASON_SHOWCASE = [
  'response body:fail',
  'connection timeout',
  'HTTP 502 Bad Gateway',
] as const;

function resolveCallbackAbnormalReason(rowIndex: number): string {
  return CALLBACK_ABNORMAL_REASON_SHOWCASE[rowIndex % CALLBACK_ABNORMAL_REASON_SHOWCASE.length];
}

const CALLBACK_EVENT_STATUS_BY_TYPE: Record<
  NonNullable<PaymentEngineRecordRow['callbackEventType']>,
  PaymentEngineOrderStatus
> = {
  'wallet-payout': 'success',
  'waas-order': 'additional-payment-required',
  'payment-exception': 'transferred',
  'waas-refund': 'pending',
};

function buildCallbackRecordId(rowIndex: number): string {
  const part1 = String(20_311_020 + rowIndex);
  const part2 = String(82_420_678 + rowIndex * 3);
  return `Number_${part1}_${part2}`;
}

function buildThirdPartyBusinessNo(rowIndex: number): string {
  return `Coinbase_order_${800_389_028 + rowIndex}`;
}

function buildCallbackErrorRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineCallbackErrorDetailRecord {
  const eventType = row.callbackEventType ?? 'wallet-payout';
  const callbackEventStatus = CALLBACK_EVENT_STATUS_BY_TYPE[eventType];
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const addressOffset = rowIndex + 9;
  const updateTime = `2031-12-23 ${String(10 + (rowIndex % 8)).padStart(2, '0')}:23:00`;

  const detail: PaymentEngineCallbackErrorDetailRecord = {
    callbackRecordId: buildCallbackRecordId(rowIndex),
    callbackUrl: row.callbackUrl ?? 'https://callback_url.com',
    updateTime,
    abnormalReason: resolveCallbackAbnormalReason(rowIndex),
    filteredReasonKey: FILTERED_REASON_KEY,
    orderId: buildCallbackRecordId(rowIndex + 11),
    merchantOrderId: row.merchantOrderId,
    callbackEventStatus,
  };

  if (eventType === 'waas-refund') {
    const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
    return {
      ...detail,
      callbackEventStatusLabelKey: 'Refunding',
      callbackEventStatusTagStatus: 'warning',
      txHash: resolveVerifiedTxHashForRow(rowIndex + 73, addressFamily),
    };
  }

  if (eventType !== 'wallet-payout') {
    const addressFamily = row.orderSymbol === 'TON' ? 'ton' as const : 'evm';
    return {
      ...detail,
      txHash: resolveVerifiedTxHashForRow(rowIndex + 73, addressFamily),
    };
  }

  return {
    ...detail,
    walletType: 'SingleSig',
    payoutId: buildCallbackRecordId(rowIndex + 3),
    thirdPartyBusinessNo: buildThirdPartyBusinessNo(rowIndex),
    transStatus: 'success',
    senderAddress: row.walletFromAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'from'),
    receiverAddress: row.walletToAddress ?? resolveDemoWalletAddress(addressOffset, currencyPreset, 'to'),
    receiverAlias: rowIndex % 2 === 0 ? 'EverGreen' : '',
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
    txHash: resolveVerifiedTxHashForRow(rowIndex + 73, 'evm'),
  };
}

export function enrichPaymentCallbackErrorRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.callbackErrorRecordDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    callbackErrorRecordDetail: buildCallbackErrorRecordDetail(row, rowIndex),
  };
}

export function resolvePaymentCallbackErrorRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineCallbackErrorDetailRecord {
  const enriched = enrichPaymentCallbackErrorRecordForDetail(row);
  return enriched.callbackErrorRecordDetail
    ?? buildCallbackErrorRecordDetail(row, resolveEgDataListDemoRowIndex(row));
}
