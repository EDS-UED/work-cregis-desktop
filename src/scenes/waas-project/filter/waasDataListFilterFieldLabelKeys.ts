import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** WaaS EgFilter 字段 i18n labelKey 真源。DataList 列头仅在该列对应筛选字段时才与之对齐。 */
export const WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS = {
  wallet: 'Wallet',
  currency: 'Currency',
  transactionTime: 'Transaction Time',
  initiationTime: 'Initiation Time',
  startTime: 'Start Time',
  endTime: 'End Date',
  completionTime: 'Completion Time',
  transactionCount: 'Transaction Count',
  incomeExpenseType: 'Income/Expense Type',
  transactionType: 'Transaction Type',
  txHash: 'Transaction hash',
  paymentAddress: 'Payment Address',
  receivingAddress: 'Receiving Address',
  addressStatus: 'Address Status',
  address: 'Address',
  addressAlias: 'Address Alias',
  callbackAddress: 'Callback Address',
  thirdPartyBizId: 'Third-party Reference',
  receiver: 'Receiver',
  sender: 'Sender',
  transactionStatus: 'Transaction Status',
  status: 'Status',
  memo: 'Memo',
  remark: 'Remark',
  amount: 'Amount',
  ruleName: 'Rule Name',
  ruleNumber: 'Rule Number',
  ruleStatus: 'Rule Status',
  collectionId: 'Collection Number',
  businessType: 'Business Type',
  pushMethod: 'Push Method',
  pushStatus: 'Push Status',
  cregisId: 'Cregis ID',
} as const;

export type WaasDataListFilterFieldId = keyof typeof WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS;

export type WaasDataListTimeFilterFieldId = Extract<
  WaasDataListFilterFieldId,
  'transactionTime' | 'initiationTime' | 'startTime' | 'endTime' | 'completionTime'
>;

export function resolveWaasDataListFilterFieldLabelKey(fieldId: string): string {
  return (
    WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS[fieldId as WaasDataListFilterFieldId]
    ?? fieldId
  );
}

/** 与 EgFilter 时间字段成对：列表列头 = 筛选基词 + ` UTC+08:00`。 */
export function waasDataListTimeColumnLabelKey(
  fieldId: WaasDataListTimeFilterFieldId,
): string {
  return dataListTimeColumnLabelKey(WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS[fieldId]);
}
