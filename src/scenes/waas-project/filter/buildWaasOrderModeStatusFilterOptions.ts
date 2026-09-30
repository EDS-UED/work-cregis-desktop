import type { EgFilterFieldStatusOption, TagStatus } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import type {
  PaymentEngineOrderStatus,
  PaymentEngineRecordRow,
} from '../../payment-engine/paymentEngineRecordConfigs';
import { buildPaymentEngineRecordStatusCustomize } from '../../payment-engine/paymentEngineRecordStatusCustomize';
import {
  PAYMENT_ENGINE_ORDER_STATUS_LABEL_KEYS,
  resolvePaymentEngineOrderStatusLabelKey,
} from '../../payment-engine/paymentEngineOrderStatusLabels';
import { buildPaymentEngineRecordRows } from '../../payment-engine/paymentEngineOrderRecordData';

const ORDER_MODE_STATUS_NAMESPACE = 'waas-order-mode-status';

const ORDER_RECORD_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = (
  Object.keys(PAYMENT_ENGINE_ORDER_STATUS_LABEL_KEYS) as Array<
    keyof typeof PAYMENT_ENGINE_ORDER_STATUS_LABEL_KEYS
  >
).map((status) => ({
  id: resolveDataListFilterOptionId(
    ORDER_MODE_STATUS_NAMESPACE,
    resolvePaymentEngineOrderStatusLabelKey(status),
  ),
  label: resolvePaymentEngineOrderStatusLabelKey(status),
  status: status === 'additional-payment-required' || status === 'initiated'
    ? 'warning' as const
    : status === 'cancelled' || status === 'expired'
      ? 'invalid' as const
      : 'success' as const,
}));

const CALLBACK_PUSH_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  { id: 'waas-callback-normal', label: 'Normal', status: 'success' },
  { id: 'waas-callback-ignore', label: 'Ignore', status: 'invalid' },
];

function uniqueStatusOptionsFromRows(
  rows: PaymentEngineRecordRow[],
  menuItem: string,
): EgFilterFieldStatusOption[] {
  const options: EgFilterFieldStatusOption[] = [];
  const seen = new Set<string>();

  for (const [rowIndex, row] of rows.entries()) {
    const customize = buildPaymentEngineRecordStatusCustomize(row, menuItem);
    const label = String(customize.label ?? '').trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push({
      id: resolveDataListFilterOptionId(ORDER_MODE_STATUS_NAMESPACE, label),
      label,
      status: String(customize.status ?? 'success') as TagStatus,
    });
  }

  return options;
}

export function buildWaasOrderModeStatusFilterOptions(
  rowCount: number,
  menuItem: string,
  fieldId: string,
): EgFilterFieldStatusOption[] {
  if (menuItem === 'Order Record' && fieldId === 'orderStatus') {
    return [...ORDER_RECORD_STATUS_OPTIONS];
  }
  if (menuItem === 'History Callback' && fieldId === 'pushStatus') {
    return [...CALLBACK_PUSH_STATUS_OPTIONS];
  }

  const rows = buildPaymentEngineRecordRows(menuItem, Math.max(0, rowCount));
  return uniqueStatusOptionsFromRows(rows, menuItem);
}

export function resolveWaasOrderModeFilterStatusOptionId(
  row: PaymentEngineRecordRow,
  menuItem: string,
  fieldId: string,
  rowIndex = 0,
): string {
  if (menuItem === 'History Callback' && fieldId === 'pushStatus') {
    return row.callbackStatus === 'ignore' ? 'waas-callback-ignore' : 'waas-callback-normal';
  }

  if (menuItem === 'Order Record' && fieldId === 'orderStatus') {
    return resolveDataListFilterOptionId(
      ORDER_MODE_STATUS_NAMESPACE,
      resolvePaymentEngineOrderStatusLabelKey(row.status as PaymentEngineOrderStatus),
    );
  }

  const customize = buildPaymentEngineRecordStatusCustomize(row, menuItem);
  return resolveDataListFilterOptionId(
    ORDER_MODE_STATUS_NAMESPACE,
    String(customize.label ?? ''),
  );
}
