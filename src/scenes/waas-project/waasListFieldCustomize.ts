import { applyCurrencyRowTagVisibility } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import {
  buildCurrencyRowPresetCustomize,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildWalletPayoutCryptoCustomize } from '@/scenes/payment-engine/paymentEngineListFieldCustomize';

export function buildWaasRuleCollectionCurrencyCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const customize = buildCurrencyRowPresetCustomize(rowIndex);
  return applyCurrencyRowTagVisibility(
    {
      ...customize,
      comboMode: 'currency-only',
      entryBadgeMode: 'none',
      fromSideVisible: false,
      toSideVisible: false,
      minWidth: columnMinWidth,
    },
    -1,
  );
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

export function buildWaasAmountAddressCustomize(
  row: PaymentEngineRecordRow,
  columnMinWidth = '',
): Record<string, unknown> {
  const cryptoCustomize = buildWalletPayoutCryptoCustomize(row, columnMinWidth);
  const networkLabel = String(cryptoCustomize.networkLabel ?? '').trim();

  return {
    ...cryptoCustomize,
    amountType: 'amount-address',
    addressType: 'double',
    cryptoValue: row.orderAmount,
    cryptoSymbol: row.orderSymbol ?? cryptoCustomize.symbol,
    cryptoName: row.currencyCryptoName ?? cryptoCustomize.cryptoName,
    fiatValue: row.orderFiat,
    showCryptoIcon: true,
    showNetwork: Boolean(networkLabel),
    networkLabel,
    addressTooltipTrigger: 'hover',
    minWidth: columnMinWidth,
  };
}

/** @deprecated Use buildWaasAmountAddressCustomize */
export const buildWaasProcessingAmountCustomize = buildWaasAmountAddressCustomize;
