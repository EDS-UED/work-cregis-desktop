import {
  defaultConditionFilterRows,
  filledConditionFilterRows,
  type ConditionFilterFieldOption,
  type ConditionFilterRow,
} from '@/components/condition-filter/conditionFilter';
import type { PaymentEngineListKind } from './paymentEngineData';

export const PAYMENT_ENGINE_FILTER_FIELDS: Record<
  PaymentEngineListKind,
  ConditionFilterFieldOption[]
> = {
  'Order Record': [
    { key: 'orderId', labelKey: 'Order ID' },
    { key: 'merchantOrderId', labelKey: 'Merchant Order ID' },
    { key: 'status', labelKey: 'Order Status' },
  ],
  'Settlement Record': [
    { key: 'token', labelKey: 'Token' },
    { key: 'address', labelKey: 'Address' },
    { key: 'status', labelKey: 'Status' },
    { key: 'settlementNumber', labelKey: 'Settlement Number' },
  ],
  'Payment Exception Record': [
    { key: 'token', labelKey: 'Token' },
    { key: 'status', labelKey: 'Status' },
    { key: 'amount', labelKey: 'Amount' },
  ],
  'Callback Record': [
    { key: 'orderId', labelKey: 'Order ID' },
    { key: 'status', labelKey: 'Status' },
    { key: 'event', labelKey: 'Event' },
  ],
};

export function paymentEngineFilterDefaultKeys(kind: PaymentEngineListKind): string[] {
  return PAYMENT_ENGINE_FILTER_FIELDS[kind].map((field) => field.key);
}

export function defaultPaymentEngineFilterRows(kind: PaymentEngineListKind): ConditionFilterRow[] {
  return defaultConditionFilterRows(paymentEngineFilterDefaultKeys(kind));
}

export function recordMatchesFilter(
  haystack: string,
  conditions: ConditionFilterRow[],
): boolean {
  const filled = filledConditionFilterRows(conditions);
  if (filled.length === 0) return true;
  const lower = haystack.toLowerCase();
  return filled.every((condition) => lower.includes(condition.value.trim().toLowerCase()));
}
