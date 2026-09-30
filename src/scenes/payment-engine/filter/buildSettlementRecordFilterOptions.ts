import type {
  EgFilterFieldDropdownOption,
  EgFilterFieldStatusOption,
  TagStatus,
} from '@eds/desktop-components';
import {
  resolveDataListFilterOptionId,
  uniqueDataListFilterOptions,
} from '../../shared/dataListFilterOptionUtils';
import { buildPaymentEngineRecordRows } from '../paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS } from './paymentRecordFilterCatalog';
import { resolvePaymentRecordPaymentCurrencyLabel } from './resolvePaymentRecordPaymentCurrencyLabel';
import {
  SETTLEMENT_RECORD_CURRENCY_NAMESPACE,
  SETTLEMENT_RECORD_STATUS_NAMESPACE,
} from './settlementRecordFilterNamespaces';

const SETTLEMENT_STATUS_LABEL_KEYS = ['Settling', 'Settled'] as const;

const SETTLEMENT_STATUS_TAG_BY_LABEL: Record<string, TagStatus> = {
  Settling: 'warning',
  Settled: 'success',
};

function buildSettlementStatusOptions(): EgFilterFieldStatusOption[] {
  return SETTLEMENT_STATUS_LABEL_KEYS.map((label) => ({
    id: resolveDataListFilterOptionId(SETTLEMENT_RECORD_STATUS_NAMESPACE, label),
    label,
    status: SETTLEMENT_STATUS_TAG_BY_LABEL[label] ?? 'success',
  }));
}

function buildSettlementCurrencyOptions(
  rows: readonly PaymentEngineRecordRow[],
): EgFilterFieldDropdownOption[] {
  const labels: string[] = [...PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS];

  for (const row of rows) {
    const derived = resolvePaymentRecordPaymentCurrencyLabel(row);
    if (derived) labels.push(derived);
  }

  return uniqueDataListFilterOptions(SETTLEMENT_RECORD_CURRENCY_NAMESPACE, labels);
}

export type SettlementRecordFilterRowOptions = {
  settlementStatusOptions: EgFilterFieldStatusOption[];
  settlementCurrencyOptions: EgFilterFieldDropdownOption[];
};

export function buildSettlementRecordFilterOptionsFromRows(
  rowCount: number,
): SettlementRecordFilterRowOptions {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildPaymentEngineRecordRows('Settlement Record', safeRowCount);

  return {
    settlementStatusOptions: buildSettlementStatusOptions(),
    settlementCurrencyOptions: buildSettlementCurrencyOptions(rows),
  };
}
