import {
  buildPaymentEngineRecordRows,
  resolvePaymentEngineRecordRowCount,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';

export function buildWaasOrderModeRecordRows(
  menuItem: string,
  count = resolvePaymentEngineRecordRowCount(menuItem),
) {
  return buildPaymentEngineRecordRows(menuItem, count);
}
