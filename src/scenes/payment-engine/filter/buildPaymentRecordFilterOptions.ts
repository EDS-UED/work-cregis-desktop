import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
  EgFilterFieldStatusOption,
  TagStatus,
} from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '../../shared/dataListFilterOptionUtils';
import {
  resolveDataListFilterOptionId,
  uniqueDataListFilterOptions,
} from '../../shared/dataListFilterOptionUtils';
import { resolveDataListCryptoName } from '../../shared/resolveDataListCryptoName';
import { buildPaymentEngineRecordRows } from '../paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import {
  resolvePaymentEngineOrderStatusLabelKey,
  resolvePaymentEngineOrderStatusTagVariant,
} from '../paymentEngineOrderStatusLabels';
import type { PaymentEngineOrderStatus } from '../paymentEngineRecordConfigs';
import {
  PAYMENT_RECORD_ORDER_CRYPTO_CURRENCY_SYMBOLS,
  PAYMENT_RECORD_ORDER_FIAT_CURRENCY_SYMBOLS,
  PAYMENT_RECORD_ORDER_STATUS_SEQUENCE,
  PAYMENT_RECORD_SETTLEMENT_STATUS_LABEL_KEYS,
} from './paymentRecordFilterCatalog';
import {
  PAYMENT_RECORD_ORDER_CURRENCY_NAMESPACE,
  PAYMENT_RECORD_ORDER_STATUS_NAMESPACE,
  PAYMENT_RECORD_SETTLEMENT_STATUS_NAMESPACE,
} from './paymentRecordFilterNamespaces';
import { buildPaymentRecordPaymentCurrencyFilterOptions } from './buildPaymentRecordPaymentCurrencyFilterOptions';

const SETTLEMENT_STATUS_TAG_BY_LABEL: Record<string, TagStatus> = {
  Settling: 'warning',
  Settled: 'success',
};

function buildOrderStatusFilterOption(status: PaymentEngineOrderStatus): EgFilterFieldStatusOption {
  const label = resolvePaymentEngineOrderStatusLabelKey(status);
  const variant = resolvePaymentEngineOrderStatusTagVariant(status);
  const base = {
    id: resolveDataListFilterOptionId(PAYMENT_RECORD_ORDER_STATUS_NAMESPACE, label),
    label,
  };
  if (variant.kind === 'colorful') {
    return { ...base, colorfulStyle: variant.colorfulStyle };
  }
  return { ...base, status: variant.status };
}

function buildOrderStatusOptions(): EgFilterFieldStatusOption[] {
  return PAYMENT_RECORD_ORDER_STATUS_SEQUENCE.map((status) => buildOrderStatusFilterOption(status));
}

function buildSettlementStatusOptions(): EgFilterFieldStatusOption[] {
  return PAYMENT_RECORD_SETTLEMENT_STATUS_LABEL_KEYS.map((label) => ({
    id: resolveDataListFilterOptionId(PAYMENT_RECORD_SETTLEMENT_STATUS_NAMESPACE, label),
    label,
    status: SETTLEMENT_STATUS_TAG_BY_LABEL[label] ?? 'success',
  }));
}

function buildOrderCurrencyDropdownOptions(
  rows: readonly PaymentEngineRecordRow[],
): EgFilterFieldDropdownOption[] {
  const labels: string[] = [
    ...PAYMENT_RECORD_ORDER_FIAT_CURRENCY_SYMBOLS,
    ...PAYMENT_RECORD_ORDER_CRYPTO_CURRENCY_SYMBOLS,
  ];

  for (const row of rows) {
    const fiatMatch = /^[\d,.]+\s+(\S+)$/.exec(String(row.orderFiat ?? '').trim());
    if (fiatMatch?.[1]) labels.push(fiatMatch[1]);
    if (row.orderSymbol.trim()) labels.push(row.orderSymbol.trim());
  }

  return uniqueDataListFilterOptions(PAYMENT_RECORD_ORDER_CURRENCY_NAMESPACE, labels);
}

function buildOrderCurrencyPickerOptions(
  rows: readonly PaymentEngineRecordRow[],
): EgFilterFieldCurrencyOption[] {
  const dropdownLabels = buildOrderCurrencyDropdownOptions(rows).map((option) => option.label);

  return dropdownLabels
    .map((label, index) => ({
      id: `${index}-${label.toLowerCase()}`,
      label,
      cryptoName: resolveDataListCryptoName(label),
    }))
    .sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}

export type PaymentRecordFilterRowOptions = {
  orderStatusOptions: EgFilterFieldStatusOption[];
  settlementStatusOptions: EgFilterFieldStatusOption[];
  orderCurrencyOptions: EgFilterFieldCurrencyOption[];
  orderCurrencyDropdownOptions: EgFilterFieldDropdownOption[];
  paymentCurrencyOptions: EgFilterFieldCurrencyOption[];
};

export function buildPaymentRecordFilterOptionsFromRows(
  rowCount: number,
): PaymentRecordFilterRowOptions {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildPaymentEngineRecordRows('Payment Record', safeRowCount);

  return {
    orderStatusOptions: buildOrderStatusOptions(),
    settlementStatusOptions: buildSettlementStatusOptions(),
    orderCurrencyOptions: buildOrderCurrencyPickerOptions(rows),
    orderCurrencyDropdownOptions: buildOrderCurrencyDropdownOptions(rows),
    paymentCurrencyOptions: buildPaymentRecordPaymentCurrencyFilterOptions(rows),
  };
}
