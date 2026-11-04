export const ORDER_MANAGEMENT_FILTER_FIELD_LABEL_KEYS = {
  orderOperationType: 'Fee Operation Type',
  orderStatus: 'Status',
  orderCompletionTime: 'Completion Time',
} as const;

export type OrderManagementFilterFieldId = keyof typeof ORDER_MANAGEMENT_FILTER_FIELD_LABEL_KEYS;

export const ORDER_MANAGEMENT_FILTER_FIELD_IDS: readonly OrderManagementFilterFieldId[] = [
  'orderOperationType',
  'orderStatus',
  'orderCompletionTime',
];
