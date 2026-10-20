import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX,
  CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildWaasOrderModeRecordRows } from '@/scenes/waas-project/waasOrderModeRecordData';
import { applyWaasOrderModeScenario } from './waasScenarioActions';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetWaasHistoryCallbackScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyWaasHistoryCallbackDetailScenario(
  rowIndex: number,
  activeTab = 0,
) {
  resetWaasHistoryCallbackScenarioBaseline();
  applyWaasOrderModeScenario();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildWaasOrderModeRecordRows('History Callback')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'History Callback', activeTab);
}

/** 第 1 行 · 提币 · 回调 Tab（忽略 / 自动推送 / 过滤原因）。 */
export function applyWaasHistoryCallbackIgnoreStatusTabScenario() {
  applyWaasHistoryCallbackDetailScenario(CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX, 0);
}

/** 第 2 行 · 订单记录 · 回调 Tab（正常 / 自动推送 / 过滤原因）。 */
export function applyWaasHistoryCallbackNormalStatusTabScenario() {
  applyWaasHistoryCallbackDetailScenario(CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX, 0);
}

/** 第 2 行 · 订单记录 · 订单相关 Tab。 */
export function applyWaasHistoryCallbackOrderRelatedTabScenario() {
  applyWaasHistoryCallbackDetailScenario(CALLBACK_ERROR_WAAS_ORDER_SHOWCASE_ROW_INDEX, 1);
}

/** 第 1 行 · 提币 · 钱包提币 Tab。 */
export function applyWaasHistoryCallbackWalletPayoutRelatedTabScenario() {
  applyWaasHistoryCallbackDetailScenario(CALLBACK_ERROR_WALLET_PAYOUT_SHOWCASE_ROW_INDEX, 1);
}
