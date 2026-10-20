import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** WaaS 订单模式 EgFilter 字段 i18n labelKey 真源。 */
export const WAAS_ORDER_MODE_FILTER_FIELD_LABEL_KEYS = {
  merchantOrderId: 'Merchant Order ID',
  orderId: 'Order ID',
  createdAt: 'Creation Time',
  paymentTxHash: 'Payment Transaction Hash',
  orderStatus: 'Order Status',
  orderCurrency: 'Order Currency',
  orderAmount: 'Order Amount',
  receivingCurrency: 'Receiving Currency',
  bulkTransferId: 'Bulk Transfer ID',
  bulkTransferStatus: 'Bulk Transfer Status',
  bulkTransferAmount: 'Amount',
  transferCurrency: 'Transfer Currency',
  currency: 'Currency',
  refundReason: 'Refund Reason',
  refundStatus: 'Refund Status',
  refundType: 'Refund Type',
  sender: 'Sender',
  receiver: 'Receiver',
  txHash: 'Transaction hash',
  abnormalReason: 'Abnormal Reason',
  transferStatus: 'Transfer Status',
  thirdPartyBizId: 'Third-party Reference',
  transactionStatus: 'Transaction Status',
  transactionTime: 'Transaction Time',
  memo: 'Memo',
  remark: 'Remark',
  cregisId: 'Callback Event ID',
  businessType: 'Callback Event',
  callbackAddress: 'Callback URL',
  callbackTime: 'Callback Time',
  pushStatus: 'Callback Status',
} as const;

export type WaasOrderModeFilterFieldId = keyof typeof WAAS_ORDER_MODE_FILTER_FIELD_LABEL_KEYS;

export type WaasOrderModeTimeFilterFieldId = Extract<
  WaasOrderModeFilterFieldId,
  'createdAt' | 'transactionTime' | 'callbackTime'
>;

export function waasOrderModeTimeColumnLabelKey(
  fieldId: WaasOrderModeTimeFilterFieldId,
): string {
  return dataListTimeColumnLabelKey(WAAS_ORDER_MODE_FILTER_FIELD_LABEL_KEYS[fieldId]);
}
