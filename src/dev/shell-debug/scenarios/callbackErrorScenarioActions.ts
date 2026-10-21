import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  buildPaymentEngineRecordRows,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';

/** 第 6 行 · 异常支付单 · 未转账。 */
const PAYMENT_ENGINE_CALLBACK_ERROR_EXCEPTION_CALLBACK_TAB_ROW_INDEX = 5;
/** 第 8 行 · 异常支付单 · 转账成功。 */
const PAYMENT_ENGINE_CALLBACK_ERROR_EXCEPTION_RELATED_TAB_ROW_INDEX = 7;
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

/** 第 6 行 · 异常支付单 · 回调 Tab。 */
export function applyCallbackErrorPaymentExceptionCallbackTabScenario() {
  applyCallbackErrorDetailScenario(
    PAYMENT_ENGINE_CALLBACK_ERROR_EXCEPTION_CALLBACK_TAB_ROW_INDEX,
    0,
  );
}

/** 第 8 行 · 异常支付单 · 收款相关 Tab。 */
export function applyCallbackErrorPaymentExceptionRelatedTabScenario() {
  applyCallbackErrorDetailScenario(
    PAYMENT_ENGINE_CALLBACK_ERROR_EXCEPTION_RELATED_TAB_ROW_INDEX,
    1,
  );
}
