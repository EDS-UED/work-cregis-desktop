import { applyCurrencyRowTagVisibility } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import {
  buildCurrencyRowPresetCustomize,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildRefundTokenCryptoCustomize } from '@/scenes/payment-engine/paymentEngineListFieldCustomize';
import { buildWalletPayoutCryptoCustomize } from '@/scenes/payment-engine/paymentEngineListFieldCustomize';

export function buildWaasRuleCollectionCurrencyCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  const customize = buildRefundTokenCryptoCustomize(row, columnMinWidth);
  return {
    ...customize,
    symbol: row.currencySymbol ?? customize.symbol,
    cryptoName: row.currencyCryptoName ?? customize.cryptoName,
    showNetwork: row.currencyShowNetwork ?? true,
    networkLabel: row.currencyNetwork ?? customize.networkLabel,
  };
}

export function buildWaasTaskCurrencyCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const presetCustomize = buildCurrencyRowPresetCustomize(rowIndex);
  const customize: Record<string, unknown> = {
    ...presetCustomize,
    symbol: row.currencySymbol ?? presetCustomize.symbol,
    cryptoName: row.currencyCryptoName ?? presetCustomize.cryptoName,
    showNetwork: row.currencyShowNetwork ?? Boolean(String(row.currencyNetwork ?? '').trim()),
    networkLabel: row.currencyNetwork ?? presetCustomize.networkLabel ?? '',
    comboMode: 'single-address',
    entryBadgeMode: 'none',
    addressTooltipTrigger: 'hover',
    fromSideVisible: true,
    toSideVisible: false,
    fromAddress1: row.collectionId ?? row.id,
    minWidth: columnMinWidth,
  };
  return applyCurrencyRowTagVisibility(customize, -1);
}

export function buildWaasCollectionAddressCryptoCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  return buildWalletPayoutCryptoCustomize(row, columnMinWidth);
}
