import {
  buildDemoHexRecordId,
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
  resolveShowcaseThenCompletedStatus,
} from '@/scenes/shared/egDataListMockData';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineCallbackEventType,
  PaymentEngineCallbackStatus,
  PaymentEngineCallbackTriggerMode,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

/** @deprecated 使用 resolveEgDataListDemoRowIndex */
export const resolvePaymentEngineDemoRowIndex = resolveEgDataListDemoRowIndex;

/** WaaS / 支付引擎列表演示行数（分页 Total N Results）。 */
export const PAYMENT_ENGINE_RECORD_ROW_COUNT = 28;

/** @deprecated 回调列表与 WaaS 其它 EgDataList 同为 28 行，使用 PAYMENT_ENGINE_RECORD_ROW_COUNT。 */
export const PAYMENT_ENGINE_CALLBACK_RECORD_ROW_COUNT = PAYMENT_ENGINE_RECORD_ROW_COUNT;

/** @deprecated 使用 PAYMENT_ENGINE_RECORD_ROW_COUNT */
export const PAYMENT_ORDER_RECORD_ROW_COUNT = PAYMENT_ENGINE_RECORD_ROW_COUNT;

/** 前 6 行依次展示完整订单状态；第 7 行起均为已转账。 */
export const PAYMENT_ORDER_RECORD_STATUS_SHOWCASE_COUNT = 6;

export const PAYMENT_ORDER_RECORD_MENU_ITEMS = new Set([
  'Order Record',
  'Payment Record',
]);

export const PAYMENT_EXCEPTION_RECORD_MENU_ITEMS = new Set(['Payment Exception Record']);

export const PAYMENT_CALLBACK_RECORD_MENU_ITEMS = new Set([
  'Callback Error',
  'History Callback',
]);

export const PAYMENT_SETTLEMENT_RECORD_MENU_ITEMS = new Set(['Settlement Record']);

export const PAYMENT_BULK_TRANSFER_RECORD_MENU_ITEMS = new Set(['Bulk Transfer Record']);

export const PAYMENT_REFUND_RECORD_MENU_ITEMS = new Set([
  'Refund Record',
]);

const ORDER_RECORD_HYPE = {
  symbol: 'HYPE',
  network: 'Base',
} as const;

/** 订单记录 showcase 行 index（0-based，与列表前 6 行状态 showcase 对齐）。 */
export const PAYMENT_ORDER_RECORD_INITIATED_SHOWCASE_ROW_INDEX = 0;
export const PAYMENT_ORDER_RECORD_ADDITIONAL_PAYMENT_SHOWCASE_ROW_INDEX = 1;
export const PAYMENT_ORDER_RECORD_PAID_SHOWCASE_ROW_INDEX = 2;
/** 第 4 行：已转账 + 退款信息第三 Tab。 */
export const PAYMENT_ORDER_RECORD_REFUND_SHOWCASE_ROW_INDEX = 3;
export const PAYMENT_ORDER_RECORD_CANCELLED_SHOWCASE_ROW_INDEX = 4;
export const PAYMENT_ORDER_RECORD_EXPIRED_SHOWCASE_ROW_INDEX = 5;
/** 第 7 行：已转账 + 批量转账详情第三 Tab。 */
export const PAYMENT_ORDER_RECORD_BULK_TRANSFER_SHOWCASE_ROW_INDEX = 6;

/** 支付记录：前 2 行结算中，其余均为已结算。 */
const SETTLEMENT_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'pending',
  'pending',
];

/** 批量转账：前 3 行展示转账中 / 完成 / 失败，其余均为完成。 */
const BULK_TRANSFER_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'pending',
  'success',
  'failed',
];

/** 钱包提币：前 6 行依次展示完整状态；第 7 行起均为已完成。 */
const WALLET_PAYOUT_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'external-pending',
  'approving',
  'signature-pending',
  'signed-pending-confirmation',
  'transaction-failed',
  'completed',
];

/** 退款：前 4 行展示发起 / 退款中 / 失败 / 已退款，其余均为已退款。 */
const REFUND_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'initiated',
  'pending',
  'failed',
  'success',
];

const WALLET_PAYOUT_ALIASES = [
  { from: 'Mr. Wang', to: 'Binance. User' },
  { from: '0x55e8...d31c38', to: '0xf30b...d25f12' },
] as const;

/** 异常支付单：前 5 行待处理，其余均为已转账。 */
const PAYMENT_EXCEPTION_PENDING_SHOWCASE_COUNT = 5;

/** 异常支付单目标地址别名（按行 index；无别名则展示地址）。 */
const PAYMENT_EXCEPTION_TO_ALIASES: readonly (string | undefined)[] = [
  undefined,
  undefined,
  'Mr. Wang',
  'Binance. User',
  'Coinbase. Deposit_3',
  undefined,
  undefined,
  'Gate. Withdraw',
];

export type PaymentOrderRecordRowSeed = {
  orderIdSuffix: number | null;
  merchantOrderId: string;
  status: PaymentEngineRecordRow['status'];
  orderCryptoAmount: string;
  orderFiatAmount: string;
  orderFiatSymbol: 'USDT' | 'USD';
  networkLabel?: string;
};

type CallbackRecordSeed = {
  eventType: PaymentEngineCallbackEventType;
  triggerMode: PaymentEngineCallbackTriggerMode;
  eventId: string;
  amount: string;
  symbol: string;
  networkLabel?: string;
  callbackStatus: PaymentEngineCallbackStatus;
  callbackUrl: string;
};

/** 历史回调：前 2 行展示忽略 / 正常，第 3 行起均为正常（§7.8）。 */
const HISTORY_CALLBACK_STATUS_SHOWCASE: readonly PaymentEngineCallbackStatus[] = [
  'ignore',
  'normal',
];

/** 回调事件：前 4 行依次展示提币 / WaaS 订单 / 异常支付单 / WaaS 退款单。 */
const CALLBACK_EVENT_TYPE_SHOWCASE: readonly PaymentEngineCallbackEventType[] = [
  'wallet-payout',
  'waas-order',
  'payment-exception',
  'waas-refund',
];

const CALLBACK_RECORD_SEEDS: readonly CallbackRecordSeed[] = [
  {
    eventType: 'wallet-payout',
    triggerMode: 'auto',
    eventId: '897bfc89f49640cca5553ad26883c612',
    amount: '5000',
    symbol: 'ZEC',
    callbackStatus: 'normal',
    callbackUrl: 'https://www.cregis.com/callback',
  },
  {
    eventType: 'waas-order',
    triggerMode: 'auto',
    eventId: '897bfc89f49640cca5553ad26883c612',
    amount: '61282.9627',
    symbol: 'TRX',
    callbackStatus: 'normal',
    callbackUrl: 'https://www.x.com',
  },
  {
    eventType: 'payment-exception',
    triggerMode: 'manual',
    eventId: '897bfc89f49640cca5553ad26883c612',
    amount: '0.0699',
    symbol: 'USDT',
    networkLabel: 'Base',
    callbackStatus: 'ignore',
    callbackUrl: 'https://www.cregis.com/callback',
  },
  {
    eventType: 'waas-refund',
    triggerMode: 'manual',
    eventId: '897bfc89f49640cca5553ad26883c612',
    amount: '6.7668',
    symbol: 'USDT',
    callbackStatus: 'normal',
    callbackUrl: 'https://www.x.com',
  },
];

/** 第 1–6 行：新订单 → 需补款 → 已支付 → 已转账 → 已取消 → 已过期。 */
const PAYMENT_ORDER_RECORD_SHOWCASE_SEEDS: readonly PaymentOrderRecordRowSeed[] = [
  {
    orderIdSuffix: 528,
    merchantOrderId: '897bfc89f49640cca5553ad0e8f1a2b3c4d5e6f7890abcdef123456',
    status: 'initiated',
    orderCryptoAmount: '5000',
    orderFiatAmount: '195373.26',
    orderFiatSymbol: 'USDT',
  },
  {
    orderIdSuffix: null,
    merchantOrderId: '897bfc89f49640cca5553ad1f2a3b4c5d6e7f8091abcdef234567',
    status: 'additional-payment-required',
    orderCryptoAmount: '330',
    orderFiatAmount: '194172.76',
    orderFiatSymbol: 'USDT',
    networkLabel: ORDER_RECORD_HYPE.network,
  },
  {
    orderIdSuffix: 530,
    merchantOrderId: '897bfc89f49640cca5553ad2a3b4c5d6e7f8091abcdef345678',
    status: 'paid',
    orderCryptoAmount: '0.0699',
    orderFiatAmount: '192972.26',
    orderFiatSymbol: 'USDT',
  },
  {
    orderIdSuffix: 531,
    merchantOrderId: '897bfc89f49640cca5553ad3b4c5d6e7f8091abcdef456789',
    status: 'transferred',
    orderCryptoAmount: '20.55',
    orderFiatAmount: '191771.76',
    orderFiatSymbol: 'USDT',
  },
  {
    orderIdSuffix: 532,
    merchantOrderId: '897bfc89f49640cca5553ad4c5d6e7f8091abcdef567890',
    status: 'cancelled',
    orderCryptoAmount: '0.0699',
    orderFiatAmount: '190571.26',
    orderFiatSymbol: 'USDT',
  },
  {
    orderIdSuffix: 533,
    merchantOrderId: '897bfc89f49640cca5553ad5d6e7f8091abcdef678901',
    status: 'expired',
    orderCryptoAmount: '0.0699',
    orderFiatAmount: '189370.76',
    orderFiatSymbol: 'USDT',
  },
];

function mapPaymentEngineCryptoPreset(index: number) {
  const preset = resolveCurrencyRowPreset(index);

  return {
    symbol: preset.symbol,
    network: preset.networkLabel ?? '',
    cryptoName: preset.cryptoName,
    showNetwork: preset.showNetwork,
  };
}

function formatAmount(value: string): string {
  return formatGroupedDecimalAmount(value);
}

function bulkCryptoPreset(index: number) {
  return mapPaymentEngineCryptoPreset(index);
}

function refundCryptoPreset(index: number) {
  return mapPaymentEngineCryptoPreset(index);
}

function mapPaymentOrderRecordSeed(seed: PaymentOrderRecordRowSeed): PaymentEngineRecordRow {
  const orderAmount = formatAmount(seed.orderCryptoAmount);
  const fiatAmount = formatAmount(seed.orderFiatAmount);

  return {
    id: seed.orderIdSuffix === null ? '--' : `po1442856738070${seed.orderIdSuffix}`,
    merchantOrderId: seed.merchantOrderId,
    status: seed.status,
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '',
    receivedSymbol: ORDER_RECORD_HYPE.symbol,
    orderAmount,
    orderSymbol: ORDER_RECORD_HYPE.symbol,
    orderFiat: `${fiatAmount} ${seed.orderFiatSymbol}`,
    networkLabel: seed.networkLabel,
    currencySymbol: ORDER_RECORD_HYPE.symbol,
    currencyNetwork: ORDER_RECORD_HYPE.network,
  };
}

export function resolvePaymentOrderRecordSeedByIndex(
  rowIndex: number,
): PaymentOrderRecordRowSeed {
  if (rowIndex < PAYMENT_ORDER_RECORD_SHOWCASE_SEEDS.length) {
    return PAYMENT_ORDER_RECORD_SHOWCASE_SEEDS[rowIndex]!;
  }
  return buildTransferredOrderRecordSeed(rowIndex);
}

/** 订单记录行 index；showcase 第 2 行 id 为 `--`，不能仅靠 id 后缀反推。 */
export function resolvePaymentOrderRecordRowIndex(
  row: Pick<PaymentEngineRecordRow, 'id' | 'merchantOrderId'>,
): number {
  if (row.merchantOrderId) {
    const showcaseIndex = PAYMENT_ORDER_RECORD_SHOWCASE_SEEDS.findIndex(
      (seed) => seed.merchantOrderId === row.merchantOrderId,
    );
    if (showcaseIndex >= 0) {
      return showcaseIndex;
    }
  }

  return resolveEgDataListDemoRowIndex(row);
}

function buildTransferredOrderRecordSeed(index: number): PaymentOrderRecordRowSeed {
  const orderIdSuffix = 534 + (index - PAYMENT_ORDER_RECORD_STATUS_SHOWCASE_COUNT);
  const amountRow = resolveDemoAmountRowValues(index);

  return {
    orderIdSuffix,
    merchantOrderId: buildDemoHexRecordId(index + 528),
    status: 'transferred',
    orderCryptoAmount: amountRow.cryptoValue.replace(/,/g, ''),
    orderFiatAmount: amountRow.fiatValue.replace(/[^\d.]/g, ''),
    orderFiatSymbol: 'USDT',
  };
}

function buildPaymentOrderRecordRows(count = PAYMENT_ENGINE_RECORD_ROW_COUNT): PaymentEngineRecordRow[] {
  const rows = PAYMENT_ORDER_RECORD_SHOWCASE_SEEDS.map((seed) =>
    mapPaymentOrderRecordSeed(seed),
  );

  for (let index = rows.length; index < count; index += 1) {
    rows.push(mapPaymentOrderRecordSeed(buildTransferredOrderRecordSeed(index)));
  }

  return rows.slice(0, count);
}

function buildSettlementRecordRow(rowIndex: number): PaymentEngineRecordRow {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const amountRow = resolveDemoAmountRowValues(rowIndex);
  const status = resolveShowcaseThenCompletedStatus(rowIndex, SETTLEMENT_STATUS_SHOWCASE, 'success');
  const fiatNumeric = amountRow.fiatValue.replace(/[^\d.]/g, '');

  return {
    id: `po1442856738070${528 - rowIndex}`,
    merchantOrderId: buildDemoHexRecordId(rowIndex),
    status,
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '',
    receivedSymbol: preset.symbol,
    receivedFiat: '',
    orderAmount: amountRow.cryptoValue,
    orderSymbol: preset.symbol,
    orderFiat: `${formatAmount(fiatNumeric)} USDT`,
    networkLabel: preset.showNetwork ? preset.networkLabel : undefined,
    currencySymbol: preset.symbol,
    currencyCryptoName: preset.cryptoName,
    currencyNetwork: preset.networkLabel,
    currencyShowNetwork: preset.showNetwork,
  };
}

function buildSettlementRecordRows(
  count = PAYMENT_ENGINE_RECORD_ROW_COUNT,
): PaymentEngineRecordRow[] {
  return Array.from({ length: count }, (_, index) => buildSettlementRecordRow(index));
}

function buildBulkTransferRows(
  menuItem: string,
  count = PAYMENT_ENGINE_RECORD_ROW_COUNT,
): PaymentEngineRecordRow[] {
  const transferIdPrefix = menuItem === 'Wallet Payout' ? 'WP' : 'BT';

  return Array.from({ length: count }, (_, index) => {
    const preset = resolveCurrencyRowPreset(index);
    const crypto = bulkCryptoPreset(index);
    const amountRow = resolveDemoAmountRowValues(index);
    const amount = amountRow.cryptoValue;
    const aliases = WALLET_PAYOUT_ALIASES[index % WALLET_PAYOUT_ALIASES.length];
    const walletFromAddress = resolveDemoWalletAddress(index, preset, 'from');
    const walletToAddress = resolveDemoWalletAddress(index, preset, 'to');

    const status = menuItem === 'Wallet Payout'
      ? resolveShowcaseThenCompletedStatus(index, WALLET_PAYOUT_STATUS_SHOWCASE, 'completed')
      : resolveShowcaseThenCompletedStatus(index, BULK_TRANSFER_STATUS_SHOWCASE, 'success');

    return {
      id: `${transferIdPrefix}-${88001 + index}`,
      merchantOrderId: buildDemoHexRecordId(index),
      status,
      createdAt: '2032-10-23 12:22:54',
      receivedAmount: amount,
      receivedSymbol: crypto.symbol,
      orderAmount: amount,
      orderSymbol: crypto.symbol,
      orderFiat: amountRow.fiatValue,
      currencySymbol: crypto.symbol,
      currencyNetwork: crypto.network,
      currencyShowNetwork: crypto.showNetwork,
      currencyCryptoName: crypto.cryptoName,
      walletFromAddress,
      walletToAddress,
      bulkTransferId: buildDemoHexRecordId(index + 17),
      walletFromAlias: menuItem === 'Wallet Payout' ? aliases.from : undefined,
      walletToAlias: menuItem === 'Wallet Payout' ? aliases.to : undefined,
    };
  });
}

function buildPaymentExceptionRows(
  count = PAYMENT_ENGINE_RECORD_ROW_COUNT,
): PaymentEngineRecordRow[] {
  return Array.from({ length: count }, (_, index) => {
    const preset = resolveCurrencyRowPreset(index);
    const crypto = mapPaymentEngineCryptoPreset(index);
    const amountRow = resolveDemoAmountRowValues(index);
    const amount = amountRow.cryptoValue;
    const walletFromAddress = resolveDemoWalletAddress(index, preset, 'from');
    const walletToAddress = resolveDemoWalletAddress(index, preset, 'to');
    const walletToAlias = PAYMENT_EXCEPTION_TO_ALIASES[index % PAYMENT_EXCEPTION_TO_ALIASES.length];

    return {
      id: `PE-${88001 + index}`,
      merchantOrderId: buildDemoHexRecordId(index + 60),
      status: index < PAYMENT_EXCEPTION_PENDING_SHOWCASE_COUNT ? 'pending' : 'transferred',
      createdAt: '2032-10-23 12:22:54',
      receivedAmount: amount,
      receivedSymbol: crypto.symbol,
      orderAmount: amount,
      orderSymbol: crypto.symbol,
      orderFiat: amountRow.fiatValue,
      currencySymbol: crypto.symbol,
      currencyNetwork: crypto.network,
      currencyShowNetwork: crypto.showNetwork,
      currencyCryptoName: crypto.cryptoName,
      walletFromAddress,
      walletToAddress,
      walletToAlias,
    };
  });
}

function buildRefundRecordRows(count = PAYMENT_ENGINE_RECORD_ROW_COUNT): PaymentEngineRecordRow[] {
  return Array.from({ length: count }, (_, index) => {
    const crypto = refundCryptoPreset(index);
    const amountRow = resolveDemoAmountRowValues(index);
    const amount = amountRow.cryptoValue;

    return {
      id: `RF-${77001 + index}`,
      merchantOrderId: buildDemoHexRecordId(index + 40),
      status: resolveShowcaseThenCompletedStatus(index, REFUND_STATUS_SHOWCASE, 'success'),
      createdAt: '2032-10-23 12:22:54',
      receivedAmount: amount,
      receivedSymbol: crypto.symbol,
      receivedFiat: amountRow.fiatValue,
      orderAmount: amount,
      orderSymbol: crypto.symbol,
      orderFiat: amountRow.fiatValue,
      currencySymbol: crypto.symbol,
      currencyNetwork: crypto.network,
      currencyShowNetwork: crypto.showNetwork,
      currencyCryptoName: crypto.cryptoName,
      refundId: `RFD-${55001 + index}`,
    };
  });
}

function buildCallbackRecordRows(count = PAYMENT_ENGINE_RECORD_ROW_COUNT): PaymentEngineRecordRow[] {
  return Array.from({ length: count }, (_, index) => {
    const showcaseIndex = index % CALLBACK_EVENT_TYPE_SHOWCASE.length;
    const seed = CALLBACK_RECORD_SEEDS[showcaseIndex]!;
    const amountRow = resolveDemoAmountRowValues(index);
    const amount = amountRow.cryptoValue;

    return {
      id: `CB-${91001 + index}`,
      merchantOrderId: buildDemoHexRecordId(index + 90),
      status: 'success',
      createdAt: '2032-10-23 12:22:54',
      receivedAmount: amount,
      receivedSymbol: seed.symbol,
      orderAmount: amount,
      orderSymbol: seed.symbol,
      orderFiat: amountRow.fiatValue,
      networkLabel: seed.networkLabel,
      callbackEventType: CALLBACK_EVENT_TYPE_SHOWCASE[showcaseIndex],
      callbackTriggerMode: seed.triggerMode,
      callbackEventId: buildDemoHexRecordId(index + 100),
      callbackUrl: seed.callbackUrl,
      callbackStatus: resolveShowcaseThenCompletedStatus(
        index,
        HISTORY_CALLBACK_STATUS_SHOWCASE,
        'normal',
      ),
    };
  });
}

export function isPaymentOrderRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_ORDER_RECORD_MENU_ITEMS.has(menuItem);
}

export function isPaymentExceptionRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_EXCEPTION_RECORD_MENU_ITEMS.has(menuItem);
}

export function isPaymentCallbackRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_CALLBACK_RECORD_MENU_ITEMS.has(menuItem);
}

export function isCallbackErrorRecordMenuItem(menuItem: string): boolean {
  return menuItem === 'Callback Error';
}

export function isHistoryCallbackRecordMenuItem(menuItem: string): boolean {
  return menuItem === 'History Callback';
}

export function isCallbackRecordDetailMenuItem(menuItem: string): boolean {
  return isCallbackErrorRecordMenuItem(menuItem) || isHistoryCallbackRecordMenuItem(menuItem);
}

/** 异常回调 showcase 行：提币 / WaaS 订单 / 异常支付单 / WaaS 退款单。 */
export const CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX = 0;
export const CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX = 1;
export const CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX = 2;
export const CALLBACK_ERROR_WAAS_REFUND_SHOWCASE_ROW_INDEX = 3;

export function isPaymentSettlementRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_SETTLEMENT_RECORD_MENU_ITEMS.has(menuItem);
}

export function isPaymentBulkTransferRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_BULK_TRANSFER_RECORD_MENU_ITEMS.has(menuItem);
}

export function isPaymentRefundRecordMenuItem(menuItem: string): boolean {
  return PAYMENT_REFUND_RECORD_MENU_ITEMS.has(menuItem);
}

export function resolvePaymentEngineRecordRowCount(_menuItem?: string): number {
  return PAYMENT_ENGINE_RECORD_ROW_COUNT;
}

export function buildPaymentEngineRecordRows(
  menuItem: string,
  count = resolvePaymentEngineRecordRowCount(menuItem),
): PaymentEngineRecordRow[] {
  if (PAYMENT_ORDER_RECORD_MENU_ITEMS.has(menuItem)) {
    return buildPaymentOrderRecordRows(count);
  }

  if (PAYMENT_CALLBACK_RECORD_MENU_ITEMS.has(menuItem)) {
    return buildCallbackRecordRows(count);
  }

  if (menuItem === 'Settlement Record') {
    return buildSettlementRecordRows(count);
  }

  if (menuItem === 'Bulk Transfer Record' || menuItem === 'Wallet Payout') {
    return buildBulkTransferRows(menuItem, count);
  }

  if (menuItem === 'Refund Record') {
    return buildRefundRecordRows(count);
  }

  if (menuItem === 'Payment Exception Record') {
    return buildPaymentExceptionRows(count);
  }

  return buildPaymentOrderRecordRows(count);
}
