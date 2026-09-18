import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import { buildWaasOrderModeRecordRows } from '@/scenes/waas-project/waasOrderModeRecordData';
import { applyWaasOrderModeScenario } from './waasScenarioActions';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetWaasWalletPayoutScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.closeBulkTransferDetail();
    flow.clearBulkTransferDetailRow();
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyWaasWalletPayoutDetailScenario(rowIndex: number) {
  resetWaasWalletPayoutScenarioBaseline();
  applyWaasOrderModeScenario();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildWaasOrderModeRecordRows('Wallet Payout')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Wallet Payout');
}
