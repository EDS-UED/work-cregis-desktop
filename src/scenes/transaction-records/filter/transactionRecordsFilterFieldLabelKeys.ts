import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** 交易记录 EgFilter 字段 i18n labelKey 真源。 */
export const TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS = {
  wallet: 'Wallet',
  currency: 'Currency',
  transactionTime: 'Transaction Time',
  incomeExpenseType: 'Income/Expense Type',
  transactionType: 'Transaction Type',
  txHash: 'Transaction hash',
  paymentAddress: 'Payment Address',
  receivingAddress: 'Receiving Address',
} as const;

export type TransactionRecordsFilterFieldId =
  keyof typeof TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS;

export const TRANSACTION_RECORDS_FILTER_FIELD_IDS: readonly TransactionRecordsFilterFieldId[] = [
  'wallet',
  'currency',
  'transactionTime',
  'incomeExpenseType',
  'transactionType',
  'txHash',
  'paymentAddress',
  'receivingAddress',
];

export function transactionRecordsTimeColumnLabelKey(): string {
  return dataListTimeColumnLabelKey(
    TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS.transactionTime,
  );
}
