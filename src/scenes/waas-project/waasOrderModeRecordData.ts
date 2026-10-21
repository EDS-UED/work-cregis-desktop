import {
  buildCallbackRecordRows,
  buildPaymentEngineRecordRows,
  resolvePaymentEngineRecordRowCount,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';

export function buildWaasOrderModeRecordRows(
  menuItem: string,
  count = resolvePaymentEngineRecordRowCount(menuItem),
) {
  if (menuItem === 'Callback Error' || menuItem === 'History Callback') {
    return buildCallbackRecordRows(count, 'order-mode');
  }
  return buildPaymentEngineRecordRows(menuItem, count);
}
