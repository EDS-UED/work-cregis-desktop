import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import {
  type RiskControlAmlRecordDetailTabKind,
  resolveRiskControlAmlRecordDetailTabKinds,
} from '@/scenes/risk-control/buildRiskControlAmlRecordDetailSections';
import { riskControlAmlManualQueryOverlayRegistry } from '@/scenes/risk-control/aml-manual-query/riskControlAmlManualQueryOverlayContext';
import {
  applyAmlExceptionHandlingOutcome,
  applyAmlManualReviewOutcome,
  clearAmlQueryRecordPatches,
  mergeAmlQueryRecordPatch,
} from '@/scenes/risk-control/riskControlAmlQueryRecordStore';
import { clearQaLoadingTimeout } from '../../commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from '../../waitForPaymentEngineDetailFlow';
import { navigateToRiskControlAmlSubmenu } from '../riskControlQaNavigation';
import { waitForShellDebugRegistry } from '../waitForShellDebugRegistry';

export const AML_OUTFLOW_DANGER_ROW_INDEX = 0;
export const AML_SUSPICIOUS_ROW_INDEX = 1;
export const AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX = 2;
export const AML_QUERY_FAILED_ROW_INDEX = 3;
export const AML_DESIGNATED_HANDLER_EXCEPTION_RECORD_ID = 'AML-00003';

function resolveAmlDetailTabIndex(
  row: ReturnType<typeof buildRiskControlRecordRows>[number],
  tabKind: RiskControlAmlRecordDetailTabKind,
): number {
  const kinds = resolveRiskControlAmlRecordDetailTabKinds(row);
  const index = kinds.indexOf(tabKind);
  return index >= 0 ? index : 0;
}

export function resetRiskControlQueryRecordsQaBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();
  clearAmlQueryRecordPatches();

  const manualQuery = riskControlAmlManualQueryOverlayRegistry.value;
  manualQuery?.closeForm();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyRiskControlQueryRecordsListBaselineQa() {
  resetRiskControlQueryRecordsQaBaseline();
  navigateToRiskControlAmlSubmenu('Query Records');
  await waitForPaymentEngineDetailFlow();
}

export async function applyAmlQueryRecordDetailQa(rowIndex: number, tabIndex = 0) {
  resetRiskControlQueryRecordsQaBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildRiskControlRecordRows('Query Records')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(mergeAmlQueryRecordPatch(row), 'Query Records', tabIndex);
}

export async function applyAmlQueryRecordDetailTabKindQa(
  rowIndex: number,
  tabKind: RiskControlAmlRecordDetailTabKind,
) {
  const row = buildRiskControlRecordRows('Query Records')[rowIndex];
  if (!row) return;
  await applyAmlQueryRecordDetailQa(rowIndex, resolveAmlDetailTabIndex(row, tabKind));
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
  void applyAmlQueryRecordDetailQa(AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX, 0);
}

export async function applyAmlManualReviewDangerHeadlineQa() {
  resetRiskControlQueryRecordsQaBaseline();

  const row = buildRiskControlRecordRows('Query Records')[AML_OUTFLOW_DANGER_ROW_INDEX];
  if (!row) return;

  applyAmlManualReviewOutcome(row.id, 'danger');

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  flow.openDetailForRow(mergeAmlQueryRecordPatch(row), 'Query Records', 0);
}

export async function applyAmlManualQueryCreateFormQa() {
  resetRiskControlQueryRecordsQaBaseline();
  navigateToRiskControlAmlSubmenu('Query Records');
  await waitForPaymentEngineDetailFlow();

  const overlay = await waitForShellDebugRegistry(riskControlAmlManualQueryOverlayRegistry);
  overlay?.openForm();
}
