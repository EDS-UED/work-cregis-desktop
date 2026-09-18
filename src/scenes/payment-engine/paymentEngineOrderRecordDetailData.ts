import {
  buildDemoHexRecordId,
  resolveDemoWalletAddress,
  resolveVerifiedTxHashForRow,
} from '@/scenes/shared/egDataListMockData';
import type { CurrencyRowPreset } from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowPresets';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineOrderBulkTransferRecord,
  PaymentEngineOrderPaymentRecord,
  PaymentEngineOrderRefundRecord,
  PaymentEngineOrderRefundStatus,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

export type PaymentEngineOrderRecordDetailEnrichOptions = {
  refundStatus?: PaymentEngineOrderRefundStatus;
};
import {
  PAYMENT_ORDER_RECORD_BULK_TRANSFER_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_REFUND_SHOWCASE_ROW_INDEX,
  resolvePaymentOrderRecordRowIndex,
  resolvePaymentOrderRecordSeedByIndex,
} from './paymentEngineOrderRecordData';

const ORDER_RECORD_HYPE = {
  symbol: 'HYPE',
  network: 'Base',
} as const;

const ORDER_RECORD_ADDRESS_PRESET: CurrencyRowPreset = {
  symbol: ORDER_RECORD_HYPE.symbol,
  cryptoName: 'eds-ethereum-ethereum',
  showNetwork: true,
  networkLabel: ORDER_RECORD_HYPE.network,
  addressFamily: 'evm',
};

const ORDER_PAYMENT_WALLET_NAMES = [
  'Merchant Collection Wallet',
  'Checkout Deposit Wallet',
  'Settlement Wallet',
] as const;

const ORDER_PAYMENT_TIMESTAMPS = {
  first: '2032-10-22 18:05:11',
  additional: '2032-10-23 12:22:54',
  settled: '2032-10-23 12:22:54',
} as const;

const ORDER_REFUND_RECEIVER_ALIASES = ['EverGreen', 'Merchant Treasury', 'Settlement Pool'] as const;

function formatAmount(value: string): string {
  return formatGroupedDecimalAmount(value);
}

function parseDecimalAmount(value: string): number {
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildOrderRecordExchangeRate(
  orderCryptoAmount: string,
  orderFiatAmount: string,
  orderSymbol: string,
  fiatSymbol: string,
): string {
  const crypto = parseDecimalAmount(orderCryptoAmount);
  const fiat = parseDecimalAmount(orderFiatAmount);
  if (crypto <= 0 || fiat <= 0) {
    return `1 ${orderSymbol} ≈ 1 ${fiatSymbol}`;
  }
  const unitFiat = fiat / crypto;
  return `1 ${orderSymbol} ≈ ${formatAmount(String(unitFiat))} ${fiatSymbol}`;
}

function resolveOrderRecordReceivedAmount(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  orderAmount: string,
): string {
  const totalCrypto = parseDecimalAmount(seed.orderCryptoAmount);

  if (
    seed.status === 'initiated'
    || seed.status === 'cancelled'
    || seed.status === 'expired'
  ) {
    return '';
  }

  if (seed.status === 'additional-payment-required') {
    return formatAmount(String(totalCrypto * 0.55));
  }

  if (seed.status === 'paid' || seed.status === 'transferred') {
    return orderAmount;
  }

  return '';
}

function resolveOrderRecordReceivedFiat(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  receivedAmount: string,
  orderFiat: string,
): string | undefined {
  if (!receivedAmount.trim()) return undefined;

  const match = /^([\d,.]+)\s+(\S+)$/.exec(orderFiat.trim());
  if (!match) return undefined;

  const totalFiat = parseDecimalAmount(match[1]);
  const fiatSymbol = match[2];
  const totalCrypto = parseDecimalAmount(seed.orderCryptoAmount);
  const receivedCrypto = parseDecimalAmount(receivedAmount);
  if (totalCrypto <= 0 || receivedCrypto <= 0) return undefined;

  const receivedFiat = totalFiat * (receivedCrypto / totalCrypto);
  return `${formatAmount(String(receivedFiat))} ${fiatSymbol}`;
}

function buildOrderRecordPaymentId(
  rowId: string,
  rowIndex: number,
  paymentIndex: number,
): string {
  if (rowId !== '--') {
    return `${rowId}-P${paymentIndex + 1}`;
  }
  return buildDemoHexRecordId(rowIndex + paymentIndex * 11);
}

function buildOrderRecordPayment(
  rowIndex: number,
  rowId: string,
  paymentIndex: number,
  kind: PaymentEngineOrderPaymentRecord['kind'],
  amount: string,
  blockTimestamp: string,
  networkLabel?: string,
): PaymentEngineOrderPaymentRecord {
  const addressOffset = rowIndex + paymentIndex;

  return {
    kind,
    paymentId: buildOrderRecordPaymentId(rowId, rowIndex, paymentIndex),
    paymentWallet: ORDER_PAYMENT_WALLET_NAMES[addressOffset % ORDER_PAYMENT_WALLET_NAMES.length]!,
    amount,
    symbol: ORDER_RECORD_HYPE.symbol,
    networkLabel: networkLabel ?? ORDER_RECORD_HYPE.network,
    blockTimestamp,
    senderAddress: resolveDemoWalletAddress(addressOffset, ORDER_RECORD_ADDRESS_PRESET, 'from'),
    receiverAddress: resolveDemoWalletAddress(addressOffset, ORDER_RECORD_ADDRESS_PRESET, 'to'),
    txHash: resolveVerifiedTxHashForRow(addressOffset, 'evm'),
  };
}

function buildOrderRecordPayments(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  rowIndex: number,
  rowId: string,
  orderAmount: string,
): PaymentEngineOrderPaymentRecord[] {
  const networkLabel = seed.networkLabel ?? ORDER_RECORD_HYPE.network;
  const totalCrypto = parseDecimalAmount(seed.orderCryptoAmount);

  if (seed.status === 'additional-payment-required') {
    return [
      buildOrderRecordPayment(
        rowIndex,
        rowId,
        0,
        'first',
        formatAmount(String(totalCrypto * 0.55)),
        ORDER_PAYMENT_TIMESTAMPS.first,
        networkLabel,
      ),
      buildOrderRecordPayment(
        rowIndex,
        rowId,
        1,
        'additional',
        formatAmount(String(totalCrypto * 0.45)),
        ORDER_PAYMENT_TIMESTAMPS.additional,
        networkLabel,
      ),
    ];
  }

  if (seed.status === 'paid' || seed.status === 'transferred') {
    return [
      buildOrderRecordPayment(
        rowIndex,
        rowId,
        0,
        'first',
        orderAmount,
        ORDER_PAYMENT_TIMESTAMPS.settled,
        networkLabel,
      ),
    ];
  }

  return [];
}

function buildOrderRecordRefundId(rowId: string, rowIndex: number): string {
  if (rowId !== '--') {
    return `${rowId}-RF`;
  }
  return buildDemoHexRecordId(rowIndex + 71);
}

function buildOrderRecordServiceFee(amount: string): string {
  const parsed = parseDecimalAmount(amount);
  if (parsed <= 0) return formatAmount('0');
  const fee = parsed * 0.026;
  return formatAmount(String(Math.max(fee, 0.0001)));
}

function buildOrderRecordRefund(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  rowIndex: number,
  rowId: string,
  status: PaymentEngineOrderRefundStatus = 'pending',
): PaymentEngineOrderRefundRecord {
  const networkLabel = seed.networkLabel ?? ORDER_RECORD_HYPE.network;
  const refundBase = formatAmount(String(parseDecimalAmount(seed.orderCryptoAmount) * 0.35));
  const refundFee = buildOrderRecordServiceFee(refundBase);
  const actualRefund = formatAmount(
    String(Math.max(parseDecimalAmount(refundBase) - parseDecimalAmount(refundFee), 0)),
  );
  const addressOffset = rowIndex + 2;

  const refund: PaymentEngineOrderRefundRecord = {
    refundId: buildOrderRecordRefundId(rowId, rowIndex),
    status,
    refundTypeKey: 'Partial refund',
    refundReasonKey:
      'Others (eg. timeout, duplicate payment, incorrect payment currency, network delay, etc.)',
    payerId: String(9527 + rowIndex),
    createdAt: ORDER_PAYMENT_TIMESTAMPS.additional,
    blockTimestamp: ORDER_PAYMENT_TIMESTAMPS.settled,
    approvalTime: ORDER_PAYMENT_TIMESTAMPS.settled,
    initiatedBy: 'DJO Technology Co., Ltd.',
    remark: rowIndex % 5 === 0 ? 'This is a text.' : '',
    senderAddress: resolveDemoWalletAddress(addressOffset, ORDER_RECORD_ADDRESS_PRESET, 'from'),
    receiverAddress: resolveDemoWalletAddress(addressOffset, ORDER_RECORD_ADDRESS_PRESET, 'to'),
    receiverAlias: ORDER_REFUND_RECEIVER_ALIASES[rowIndex % ORDER_REFUND_RECEIVER_ALIASES.length],
    refundAmount: refundBase,
    refundSymbol: ORDER_RECORD_HYPE.symbol,
    networkLabel,
    refundFee: `${refundFee} ${ORDER_RECORD_HYPE.symbol}`,
    actualRefundAmount: `${actualRefund} ${ORDER_RECORD_HYPE.symbol}`,
  };

  if (status === 'success') {
    return {
      ...refund,
      blockEvent: ORDER_PAYMENT_TIMESTAMPS.settled,
      txHash: resolveVerifiedTxHashForRow(rowIndex + 40, 'evm'),
    };
  }

  return refund;
}

function buildOrderRecordBulkTransfer(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  rowIndex: number,
  rowId: string,
  orderAmount: string,
): PaymentEngineOrderBulkTransferRecord {
  const networkLabel = seed.networkLabel ?? ORDER_RECORD_HYPE.network;
  const serviceFee = buildOrderRecordServiceFee(orderAmount);

  return {
    bulkTransferId: rowId === '--'
      ? buildDemoHexRecordId(rowIndex + 83)
      : `${rowId}-BT`,
    status: 'success',
    transferAddress: resolveDemoWalletAddress(
      rowIndex,
      ORDER_RECORD_ADDRESS_PRESET,
      'from',
    ),
    createdAt: ORDER_PAYMENT_TIMESTAMPS.settled,
    transferredAmount: orderAmount,
    transferredSymbol: ORDER_RECORD_HYPE.symbol,
    networkLabel,
    serviceFee: `${serviceFee} ${ORDER_RECORD_HYPE.symbol}`,
    serviceFeeDeductedFromKey: 'Team Account Balance',
  };
}

function resolveOrderRecordSettlement(
  seed: ReturnType<typeof resolvePaymentOrderRecordSeedByIndex>,
  rowIndex: number,
  rowId: string,
  orderAmount: string,
): Pick<PaymentEngineRecordRow, 'orderRefund' | 'orderBulkTransfer'> {
  if (seed.status !== 'transferred') {
    return {};
  }

  if (rowIndex === PAYMENT_ORDER_RECORD_REFUND_SHOWCASE_ROW_INDEX) {
    return { orderRefund: buildOrderRecordRefund(seed, rowIndex, rowId, 'pending') };
  }

  if (rowIndex === PAYMENT_ORDER_RECORD_BULK_TRANSFER_SHOWCASE_ROW_INDEX) {
    return { orderBulkTransfer: buildOrderRecordBulkTransfer(seed, rowIndex, rowId, orderAmount) };
  }

  return {};
}

/** 已派生详情字段（含 QA 预置 refundStatus）时勿二次 enrich。 */
export function isPaymentOrderRecordDetailEnriched(
  row: PaymentEngineRecordRow,
): boolean {
  return (
    row.exchangeRate !== undefined
    || row.orderPayments !== undefined
    || row.orderRefund !== undefined
    || row.orderBulkTransfer !== undefined
  );
}

/** 列表行不变；打开详情时再派生 Tab / 支付 / 退款 / 批量转账字段。 */
export function enrichPaymentOrderRecordForDetail(
  row: PaymentEngineRecordRow,
  options?: PaymentEngineOrderRecordDetailEnrichOptions,
): PaymentEngineRecordRow {
  const rowIndex = resolvePaymentOrderRecordRowIndex(row);
  const seed = resolvePaymentOrderRecordSeedByIndex(rowIndex);
  const orderFiat = row.orderFiat ?? '';
  const receivedAmount = resolveOrderRecordReceivedAmount(seed, row.orderAmount);
  const cryptoName = resolveCryptoNameFromSymbol(ORDER_RECORD_HYPE.symbol) ?? 'eds-ethereum-ethereum';
  const settlement = resolveOrderRecordSettlement(seed, rowIndex, row.id, row.orderAmount);
  const refundStatus = options?.refundStatus;

  return {
    ...row,
    receivedAmount,
    receivedFiat: resolveOrderRecordReceivedFiat(seed, receivedAmount, orderFiat),
    currencyCryptoName: cryptoName,
    exchangeRate: buildOrderRecordExchangeRate(
      seed.orderCryptoAmount,
      seed.orderFiatAmount,
      ORDER_RECORD_HYPE.symbol,
      seed.orderFiatSymbol,
    ),
    orderPayments: buildOrderRecordPayments(seed, rowIndex, row.id, row.orderAmount),
    ...settlement,
    ...(settlement.orderRefund && refundStatus
      ? {
        orderRefund: buildOrderRecordRefund(seed, rowIndex, row.id, refundStatus),
      }
      : {}),
  };
}
