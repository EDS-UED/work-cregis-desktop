import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import { buildWaasOrderModeRecordRows } from '@/scenes/waas-project/waasOrderModeRecordData';
import { applyWaasOrderModeScenario } from './waasScenarioActions';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export async function applyWaasBulkTransferDetailScenario() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.closeBulkTransferDetail();
    flow.clearBulkTransferDetailRow();
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }

  applyWaasOrderModeScenario();

  const readyFlow = await waitForPaymentEngineDetailFlow();
  const row = buildWaasOrderModeRecordRows('Bulk Transfer Record')[0];
  if (!readyFlow || !row) return;

  readyFlow.openDetailForRow(row, 'Bulk Transfer Record');
}
