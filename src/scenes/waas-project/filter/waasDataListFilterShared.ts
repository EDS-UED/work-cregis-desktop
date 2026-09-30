import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import { resolveCallbackEventLabelKey } from '../../payment-engine/paymentEngineListFieldCustomize';
import type { PaymentEngineRecordRow } from '../../payment-engine/paymentEngineRecordConfigs';

export function resolveWaasFilterDropdownOptionId(
  namespace: string,
  label: string,
): string {
  return resolveDataListFilterOptionId(namespace, label);
}

export function joinWaasFilterSearchParts(values: Array<string | undefined>): string {
  return values
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

/** 收支类型 · Send→发送、Deposit→接收（非 Expense/Income 支出/收入）。 */
export function resolveWaasIncomeExpenseLabel(row: PaymentEngineRecordRow): string {
  const key = row.transactionTypeKey?.trim();
  if (key === 'Send') return 'Send';
  if (key === 'Deposit') return 'Receive';
  return '';
}

/** 与 PaymentEngineListFieldCallbackEvent 推送方式 Tag 一致。 */
export function resolveWaasPushMethodLabel(row: PaymentEngineRecordRow): string {
  if (row.callbackTriggerMode === 'manual') return 'Manual';
  if (row.callbackTriggerMode === 'auto') return 'Auto';
  return '';
}

/** 与列表 businessType / callbackEvent 文案一致。 */
export function resolveWaasBusinessTypeLabel(row: PaymentEngineRecordRow): string {
  const businessType = row.businessTypeKey?.trim();
  if (businessType) return businessType;
  if (row.callbackEventType) {
    return resolveCallbackEventLabelKey(row.callbackEventType);
  }
  return '';
}
