import { applyCurrencyRowTagVisibility } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import {
  buildCurrencyRowPresetCustomize,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

const CALLBACK_EVENT_LABEL_KEYS: Record<
  NonNullable<PaymentEngineRecordRow['callbackEventType']>,
  string
> = {
  'wallet-payout': 'Withdrawal',
  'waas-order': 'WaaS Order',
  'payment-exception': 'Payment Exception',
  'waas-refund': 'WaaS Refund',
};

export function resolveCallbackEventLabelKey(
  eventType: PaymentEngineRecordRow['callbackEventType'],
): string {
  if (!eventType) return 'Withdrawal';
  return CALLBACK_EVENT_LABEL_KEYS[eventType];
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
