import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX,
  buildPaymentEngineRecordRows,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetCallbackErrorScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyCallbackErrorDetailScenario(
  rowIndex: number,
  activeTab = 0,
) {
  resetCallbackErrorScenarioBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildPaymentEngineRecordRows('Callback Error')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Callback Error', activeTab);
}

/** 第 3 行 · 异常支付单 · 回调 Tab。 */
export function applyCallbackErrorPaymentExceptionCallbackTabScenario() {
  applyCallbackErrorDetailScenario(CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX, 0);
}

/** 第 3 行 · 异常支付单 · 收款相关 Tab。 */
export function applyCallbackErrorPaymentExceptionRelatedTabScenario() {
  applyCallbackErrorDetailScenario(CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX, 1);
}
