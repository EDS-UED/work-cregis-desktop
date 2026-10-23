import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import {
  applyAmlExceptionHandlingOutcome,
  clearAmlQueryRecordPatches,
  mergeAmlQueryRecordPatch,
} from '@/scenes/risk-control/riskControlAmlQueryRecordStore';
import { clearQaLoadingTimeout } from '../../commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from '../../waitForPaymentEngineDetailFlow';

export const AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX = 2;
export const AML_DESIGNATED_HANDLER_EXCEPTION_RECORD_ID = 'AML-00003';

export function resetRiskControlQueryRecordsQaBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();
  clearAmlQueryRecordPatches();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyAmlQueryRecordDetailQa(rowIndex: number, tabIndex = 0) {
  resetRiskControlQueryRecordsQaBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildRiskControlRecordRows('Query Records')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(mergeAmlQueryRecordPatch(row), 'Query Records', tabIndex);
}

export async function applyAmlExceptionHandlingResolvedPreviewQa(
  outcome: 'retry' | 'pass' | 'reject' = 'pass',
) {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();
  clearAmlQueryRecordPatches();

  applyAmlExceptionHandlingOutcome(AML_DESIGNATED_HANDLER_EXCEPTION_RECORD_ID, outcome);

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildRiskControlRecordRows('Query Records')[AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX];
  if (!row) return;

  flow.detailOpen.value = false;
  flow.detailRow.value = null;

  flow.openDetailForRow(mergeAmlQueryRecordPatch(row), 'Query Records', 0);
}

export function applyAmlDesignatedHandlerExceptionDetailQa() {
  applyAmlQueryRecordDetailQa(AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX, 0);
}
