/** 费用记录 · 操作类型全集（catalog key → uiTextZhCN）。 */
export const FEE_RECORD_OPERATION_TYPE_KEYS = [
  'Recharge',
  'System Recharge',
  'System Refund',
  'Team Plan Upgrade',
  'Team Plan Renewal',
  'Benefits Renewal',
  'Benefits Upgrade',
  'Automation Feature Activation',
  'Benefits Capacity Expansion',
  'Listing Application Fee',
  'Listing Application Rejection Refund',
  'Overage Service Fee',
  'Customized Plan',
  'Tron Activation Fee',
  'Tron Energy Fee',
  'Tron Bandwidth Fee',
  'AML Query',
  'Acquiring Service Fee',
  'Card Issuance Fee',
  'Account Transfer',
  'Card Replacement Fee',
] as const;

export type FeeRecordOperationTypeKey = (typeof FEE_RECORD_OPERATION_TYPE_KEYS)[number];
