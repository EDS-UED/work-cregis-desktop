import type { AppLocale } from '@/composables/useAppLocale';
import { applyCurrencyRowTagVisibility } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import {
  buildCurrencyRowPresetCustomize,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { resolveDataListCryptoName } from '@/scenes/shared/resolveDataListCryptoName';
import {
  buildTasksListFieldBusinessTypeCustomize,
} from '@/scenes/tasks/list-field/tasksListFieldBusinessTypeDefaults';
import {
  buildSenderWalletDisplayName,
} from '@/scenes/tasks/list-field/tasksListFieldBusinessTypeRowData';
import { buildTasksListFieldReceiverCustomize } from '@/scenes/tasks/list-field/tasksListFieldReceiverDefaults';
import {
  CALLBACK_ERROR_WALLET_PAYOUT_SENDER_WALLET_NAME,
  CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX,
} from './paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

const CALLBACK_EVENT_LABEL_KEYS: Record<
  NonNullable<PaymentEngineRecordRow['callbackEventType']>,
  string
> = {
  'wallet-payout': 'Withdrawal',
  'waas-order': 'Order',
  'payment-exception': 'Payment Exception',
  'waas-refund': 'WaaS Refund',
};

export function resolveCallbackEventLabelKey(
  eventType: PaymentEngineRecordRow['callbackEventType'],
): string {
  if (!eventType) return 'Withdrawal';
  return CALLBACK_EVENT_LABEL_KEYS[eventType];
}

function resolveCallbackSenderWalletDisplayName(
  row: PaymentEngineRecordRow,
  rowIndex: number,
  locale: AppLocale,
): string {
  if (
    rowIndex === CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX
    && row.callbackEventType === 'wallet-payout'
  ) {
    return CALLBACK_ERROR_WALLET_PAYOUT_SENDER_WALLET_NAME;
  }
  return buildSenderWalletDisplayName(rowIndex, locale);
}

/** 异常回调 · 发送方列（同协作 Tasks business-type 列）。 */
export function buildCallbackSenderCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
  locale: AppLocale = 'en',
  menuItem = 'Callback Error',
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const customize = buildTasksListFieldBusinessTypeCustomize(
    columnMinWidth,
    rowIndex,
    menuItem,
    locale,
  );
  if (row.walletFromAddress) {
    Object.assign(customize, {
      address: row.walletFromAddress,
      /** 主行=钱包名；勿用 walletFromAlias（那是地址侧别名语义）。 */
      addressSecondaryText: resolveCallbackSenderWalletDisplayName(row, rowIndex, locale),
    });
  }
  return customize;
}

/** 异常回调 · 接收方列（同协作 Tasks receiver 列）。 */
export function buildCallbackReceiverCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
  menuItem = 'Callback Error',
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const customize = buildTasksListFieldReceiverCustomize(rowIndex, columnMinWidth, menuItem);
  if (row.walletToAddress) {
    Object.assign(customize, {
      toAddress1: row.walletToAddress,
      /** 覆盖 Tasks 演示 toAlias；无别名时必须清空，避免非首行仍显示 Alex Mah. 等。 */
      toAlias1: row.walletToAlias?.trim() ?? '',
    });
  }
  return customize;
}

export function resolveCallbackRowBusinessTypeLabelKey(row: PaymentEngineRecordRow): string {
  return row.businessTypeKey ?? resolveCallbackEventLabelKey(row.callbackEventType);
}

/** 钱包提币：仅保留可读别名；含 `...` 的占位串交给 EDS 对完整地址做前 8 后 6 截断。 */
function isWalletPayoutReadableAlias(alias?: string): boolean {
  const trimmed = alias?.trim();
  return Boolean(trimmed) && !trimmed!.includes('...');
}

function applyWalletPayoutAddressOverrides(
  customize: Record<string, unknown>,
  row: PaymentEngineRecordRow,
): void {
  if (row.walletFromAddress) {
    customize.fromAddress1 = row.walletFromAddress;
  }
  if (row.walletToAddress) {
    customize.toAddress1 = row.walletToAddress;
  }
  if (isWalletPayoutReadableAlias(row.walletFromAlias)) {
    customize.fromAlias1 = row.walletFromAlias!.trim();
  }
  if (isWalletPayoutReadableAlias(row.walletToAlias)) {
    customize.toAlias1 = row.walletToAlias!.trim();
  }
}

function applyPaymentExceptionAddressOverrides(
  customize: Record<string, unknown>,
  row: PaymentEngineRecordRow,
): void {
  if (row.walletFromAddress) {
    customize.fromAddress1 = row.walletFromAddress;
  }
  if (row.walletToAddress) {
    customize.toAddress1 = row.walletToAddress;
  }
  if (row.walletFromAlias) {
    customize.fromAlias1 = row.walletFromAlias;
  }
  if (row.walletToAlias) {
    customize.toAlias1 = row.walletToAlias;
  }
}

function buildPaymentEngineCurrencyCustomize(
  row: PaymentEngineRecordRow,
  comboMode: 'single-address' | 'double-address',
  applyAddressOverrides?: (
    customize: Record<string, unknown>,
    row: PaymentEngineRecordRow,
  ) => void,
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const presetCustomize = buildCurrencyRowPresetCustomize(rowIndex);
  const showNetwork =
    row.currencyShowNetwork ?? Boolean(String(row.currencyNetwork ?? '').trim());

  let customize: Record<string, unknown> = {
    ...presetCustomize,
    symbol: row.currencySymbol ?? presetCustomize.symbol,
    cryptoName: row.currencyCryptoName ?? presetCustomize.cryptoName,
    showNetwork,
    networkLabel: showNetwork ? (row.currencyNetwork ?? presetCustomize.networkLabel ?? '') : '',
    comboMode,
    entryBadgeMode: 'none',
    addressTooltipTrigger: 'hover',
    fromSideVisible: true,
    toSideVisible: comboMode === 'double-address',
  };

  applyAddressOverrides?.(customize, row);

  customize = applyCurrencyRowTagVisibility(customize, -1);

  return customize;
}

export function buildBulkTransferCryptoCustomize(
  row: PaymentEngineRecordRow,
  _columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineCurrencyCustomize(row, 'single-address');
}

function buildPaymentEngineAmountAddressCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth: string,
  cryptoCustomize: Record<string, unknown>,
  addressType: 'single' | 'double',
): Record<string, unknown> {
  const networkLabel = String(cryptoCustomize.networkLabel ?? '').trim();

  return {
    ...cryptoCustomize,
    amountType: 'amount-address',
    addressType,
    cryptoValue: row.orderAmount,
    cryptoSymbol: row.currencySymbol ?? row.orderSymbol ?? cryptoCustomize.symbol,
    cryptoName: row.currencyCryptoName ?? cryptoCustomize.cryptoName,
    showCryptoIcon: true,
    showNetwork: Boolean(networkLabel),
    networkLabel,
    addressTooltipTrigger: 'hover',
    minWidth: columnMinWidth,
  };
}

export function buildBulkTransferAmountAddressCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineAmountAddressCustomize(
    row,
    columnMinWidth,
    buildBulkTransferCryptoCustomize(row, columnMinWidth),
    'single',
  );
}

export function buildPaymentExceptionAmountAddressCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineAmountAddressCustomize(
    row,
    columnMinWidth,
    buildPaymentExceptionCryptoCustomize(row, columnMinWidth),
    'double',
  );
}

export function buildWalletPayoutAmountAddressCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineAmountAddressCustomize(
    row,
    columnMinWidth,
    buildWalletPayoutCryptoCustomize(row, columnMinWidth),
    'double',
  );
}

function resolveListFieldColumnMinWidth(minWidth?: string): string {
  const matched = /^(\d+(?:\.\d+)?)/.exec(String(minWidth ?? '').trim());
  return matched?.[1] ?? '';
}

/** 订单记录 combo 金额行 · EgListFieldAmount conversion（图标 + 金额 + 链 Tag + ≈法币）。 */
export function buildPaymentEngineOrderAmountCustomize(options: {
  cryptoAmount: string;
  cryptoSymbol: string;
  cryptoName?: string;
  fiatAmount?: string;
  networkLabel?: string;
  approximateFiat?: boolean;
  columnMinWidth?: string;
  alignEnd?: boolean;
}): Record<string, unknown> {
  const networkLabel = String(options.networkLabel ?? '').trim();
  const fiat = String(options.fiatAmount ?? '').trim().replace(/^≈\s*/, '');

  return {
    amountType: 'conversion',
    cryptoValue: options.cryptoAmount,
    cryptoSymbol: options.cryptoSymbol,
    cryptoName: resolveDataListCryptoName(options.cryptoSymbol, options.cryptoName),
    fiatValue: options.approximateFiat === false ? '' : fiat,
    secondaryValue: options.approximateFiat === false ? fiat : '',
    showCryptoIcon: true,
    showNetwork: Boolean(networkLabel),
    networkLabel,
    alignEnd: options.alignEnd !== false,
    minWidth: resolveListFieldColumnMinWidth(options.columnMinWidth),
    tooltipTrigger: 'hover',
  };
}

/** 退款记录金额列 · EgListFieldAmount conversion（图标 + 金额 + 链 Tag + 法币）。 */
export function buildRefundAmountCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  const showNetwork = row.currencyShowNetwork ?? Boolean(String(row.currencyNetwork ?? '').trim());
  const networkLabel = showNetwork
    ? String(row.currencyNetwork ?? row.networkLabel ?? '').trim()
    : '';

  return buildPaymentEngineOrderAmountCustomize({
    cryptoAmount: row.orderAmount,
    cryptoSymbol: row.orderSymbol,
    cryptoName: row.currencyCryptoName,
    fiatAmount: row.orderFiat,
    networkLabel,
    columnMinWidth,
    alignEnd: false,
  });
}

export function buildWalletPayoutCryptoCustomize(
  row: PaymentEngineRecordRow,
  _columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineCurrencyCustomize(
    row,
    'double-address',
    applyWalletPayoutAddressOverrides,
  );
}

export function buildPaymentExceptionCryptoCustomize(
  row: PaymentEngineRecordRow,
  _columnMinWidth = '',
): Record<string, unknown> {
  return buildPaymentEngineCurrencyCustomize(
    row,
    'double-address',
    applyPaymentExceptionAddressOverrides,
  );
}

export function buildRefundTokenCryptoCustomize(
  row: PaymentEngineRecordRow,
  _columnMinWidth = '',
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const presetCustomize = buildCurrencyRowPresetCustomize(rowIndex);
  const showNetwork =
    row.currencyShowNetwork ?? Boolean(String(row.currencyNetwork ?? '').trim());

  return {
    ...presetCustomize,
    symbol: row.currencySymbol ?? presetCustomize.symbol,
    cryptoName: row.currencyCryptoName ?? presetCustomize.cryptoName,
    showNetwork,
    networkLabel: showNetwork ? (row.currencyNetwork ?? presetCustomize.networkLabel ?? '') : '',
    comboMode: 'currency-only',
    entryBadgeMode: 'none',
    fromSideVisible: false,
    toSideVisible: false,
  };
}

export function buildAddressBookCryptoCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  return {
    ...buildRefundTokenCryptoCustomize(row, columnMinWidth),
    minWidth: columnMinWidth,
  };
}
