import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** 支付记录 EgFilter 字段 i18n labelKey 真源。 */
export const PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS = {
  orderId: 'Order ID',
  merchantOrderId: 'Merchant Order ID',
  orderStatus: 'Order Status',
  settlementStatus: 'Settlement Status',
  createdAt: 'Creation Time',
  paymentTxHash: 'Payment Transaction Hash',
  paymentSender: 'Payment Sender',
  paymentReceiver: 'Payment Receiver',
  orderCurrency: 'Order Currency',
  orderAmount: 'Order Amount',
  paymentCurrency: 'Payment Currency',
  receivedAmount: 'Actual Received Amount',
} as const;

export type PaymentRecordFilterFieldId = keyof typeof PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS;

export function paymentRecordTimeColumnLabelKey(
  fieldId: Extract<PaymentRecordFilterFieldId, 'createdAt'>,
): string {
  return dataListTimeColumnLabelKey(PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}
