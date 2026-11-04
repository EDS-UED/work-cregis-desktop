import type { FeeRecordOperationTypeKey } from './feeRecordOperationTypes';

const FEE_RECORD_INCOME_OPERATION_KEYS = new Set<FeeRecordOperationTypeKey>([
  'Recharge',
  'System Recharge',
  'System Refund',
  'Listing Application Rejection Refund',
]);

/** 费用记录 · 充值/退款类为收入，其余为支出。 */
export function isFeeRecordIncomeOperation(
  operationTypeKey: FeeRecordOperationTypeKey,
): boolean {
  return FEE_RECORD_INCOME_OPERATION_KEYS.has(operationTypeKey);
}
