/** 费用记录 EgFilter 字段 i18n labelKey 真源。 */
export const FEE_RECORD_FILTER_FIELD_LABEL_KEYS = {
  feeOperationType: 'Fee Operation Type',
  feeTxHash: 'Transaction hash',
  feeOperator: 'Operator',
  feeTransactionTime: 'Time',
  feeAccount: 'Account',
} as const;

export type FeeRecordFilterFieldId = keyof typeof FEE_RECORD_FILTER_FIELD_LABEL_KEYS;

export const FEE_RECORD_FILTER_FIELD_IDS: readonly FeeRecordFilterFieldId[] = [
  'feeOperationType',
  'feeTxHash',
  'feeOperator',
  'feeTransactionTime',
  'feeAccount',
];
