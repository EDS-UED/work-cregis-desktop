export const ORDER_MANAGEMENT_OPERATION_TYPE_KEYS = [
  'Renewal',
  'Upgrade',
  'Benefits Renewal',
  'Benefits Capacity Expansion',
  'Automation Feature Activation',
] as const;

export type OrderManagementOperationTypeKey =
  (typeof ORDER_MANAGEMENT_OPERATION_TYPE_KEYS)[number];

export const ORDER_MANAGEMENT_STATUS_KEYS = [
  'Pending Payment',
  'Order Completed',
  'Order Cancelled',
] as const;

export type OrderManagementStatusKey = (typeof ORDER_MANAGEMENT_STATUS_KEYS)[number];

export type OrderManagementRow = {
  id: string;
  operationTypeKey: OrderManagementOperationTypeKey;
  /** 方案起止（字段 value · 禁止 ui()）。 */
  planFrom: string;
  planTo: string;
  /** 美元金额展示，如 $1,280.00（字段 value）。 */
  amountDisplay: string;
  orderPlacedTime: string;
  completionTime?: string;
  statusKey: OrderManagementStatusKey;
  /** 订单号（字段 value）。 */
  orderNumber: string;
};
