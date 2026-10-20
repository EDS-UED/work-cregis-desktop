import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX,
  CALLBACK_ERROR_WAAS_REFUND_SHOWCASE_ROW_INDEX,
  CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildWaasOrderModeRecordRows } from '@/scenes/waas-project/waasOrderModeRecordData';
import { applyWaasOrderModeScenario } from './waasScenarioActions';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetWaasCallbackErrorScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyWaasCallbackErrorDetailScenario(
  rowIndex: number,
  activeTab = 0,
) {
  resetWaasCallbackErrorScenarioBaseline();
  applyWaasOrderModeScenario();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildWaasOrderModeRecordRows('Callback Error')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Callback Error', activeTab);
}

/** 第 1 行 · 提币 · 回调 Tab。 */
export function applyWaasCallbackErrorCallbackTabScenario() {
  applyWaasCallbackErrorDetailScenario(CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX, 0);
}

/** 第 2 行 · 订单记录 · 订单相关 Tab。 */
export function applyWaasCallbackErrorOrderRelatedTabScenario() {
  applyWaasCallbackErrorDetailScenario(CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX, 1);
}

/** 第 4 行 · 退款记录 · 退款相关 Tab。 */
export function applyWaasCallbackErrorRefundRelatedTabScenario() {
  applyWaasCallbackErrorDetailScenario(CALLBACK_ERROR_WAAS_REFUND_SHOWCASE_ROW_INDEX, 1);
}

/** 第 1 行 · 提币 · 钱包提币 Tab。 */
export function applyWaasCallbackErrorWalletPayoutRelatedTabScenario() {
  applyWaasCallbackErrorDetailScenario(CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX, 1);
}
