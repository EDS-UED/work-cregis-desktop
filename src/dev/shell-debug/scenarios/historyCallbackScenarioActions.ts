import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX,
  buildPaymentEngineRecordRows,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetHistoryCallbackScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyHistoryCallbackDetailScenario(
  rowIndex: number,
  activeTab = 0,
) {
  resetHistoryCallbackScenarioBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildPaymentEngineRecordRows('History Callback')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'History Callback', activeTab);
}

/** 第 3 行 · 异常支付单 · 回调 Tab（正常 / 手动推送）。 */
export function applyHistoryCallbackManualPushTabScenario() {
  applyHistoryCallbackDetailScenario(CALLBACK_ERROR_PAYMENT_EXCEPTION_SHOWCASE_ROW_INDEX, 0);
}
