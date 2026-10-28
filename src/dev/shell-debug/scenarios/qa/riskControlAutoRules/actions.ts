import { closeAllAnchoredTooltipsForShellDebugScenarioReset } from '../../../shellDebugScenarioAnchoredLayers';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { riskControlAutoRuleFlowRegistry } from '@/scenes/risk-control/auto-rule/riskControlAutoRuleFlowContext';
import { riskControlAutoRuleOverlayRegistry } from '@/scenes/risk-control/auto-rule/riskControlAutoRuleOverlayContext';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import { waitForPaymentEngineDetailFlow } from '../../waitForPaymentEngineDetailFlow';
import { navigateToRiskControlAmlSubmenu } from '../riskControlQaNavigation';
import { waitForShellDebugRegistry } from '../waitForShellDebugRegistry';
import { resetRiskControlQueryRecordsQaBaseline } from '../riskControlQueryRecords/actions';

export const AUTO_RULE_OUTFLOW_ROW_INDEX = 0;
export const AUTO_RULE_INFLOW_ENABLED_ROW_INDEX = 1;
export const AUTO_RULE_OUTFLOW_DISABLED_ROW_INDEX = 0;

function resetAutoRuleOverlayDialogs() {
  const surface = riskControlAutoRuleOverlayRegistry.value;
  if (!surface) return;

  surface.closeForm();
  surface.noPermissionDialogOpen.value = false;
  surface.editBlockedDialogOpen.value = false;
  surface.deleteDialogOpen.value = false;
  surface.verifyOpen.value = false;
  surface.statusToggleDialogOpen.value = false;
  surface.skipDisableDialogOpen.value = false;
}

export function resetRiskControlAutoRulesQaBaseline() {
  resetRiskControlQueryRecordsQaBaseline();
  resetAutoRuleOverlayDialogs();
}

function findAutoRuleRow(
  predicate: (row: PaymentEngineRecordRow, index: number) => boolean,
): PaymentEngineRecordRow | undefined {
  const rows = buildRiskControlRecordRows('Auto Rules');
  return rows.find((row, index) => predicate(row, index));
}

async function ensureAutoRulesListPage() {
  navigateToRiskControlAmlSubmenu('Auto Rules');
  await waitForPaymentEngineDetailFlow();
}

export async function applyRiskControlAutoRulesListBaselineQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();
}

export async function applyAutoRuleOutflowDetailQa(rowIndex = AUTO_RULE_OUTFLOW_ROW_INDEX) {
  resetRiskControlAutoRulesQaBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const rows = buildRiskControlRecordRows('Auto Rules');
  const row = rows.find((entry) => entry.autoRuleDirection === 'outflow') ?? rows[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Auto Rules', 0);
}

export async function applyAutoRuleInflowDetailQa() {
  resetRiskControlAutoRulesQaBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = findAutoRuleRow((entry) => entry.autoRuleDirection === 'inflow');
  if (!row) return;

  flow.openDetailForRow(row, 'Auto Rules', 0);
}

export async function applyAutoRuleCreateFormQa(direction: 'inflow' | 'outflow') {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const overlay = await waitForShellDebugRegistry(riskControlAutoRuleOverlayRegistry);
  overlay?.confirmCreateDirection(direction);
}

export async function applyAutoRuleEditDisabledOutflowQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const row = buildRiskControlRecordRows('Auto Rules')[AUTO_RULE_OUTFLOW_DISABLED_ROW_INDEX];
  if (!row) return;

  const flowApi = await waitForShellDebugRegistry(riskControlAutoRuleFlowRegistry);
  flowApi?.startEdit(row);
}

export async function applyAutoRuleEditBlockedDialogQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const row = buildRiskControlRecordRows('Auto Rules')[AUTO_RULE_INFLOW_ENABLED_ROW_INDEX];
  if (!row?.ruleEnabled) return;

  const flowApi = await waitForShellDebugRegistry(riskControlAutoRuleFlowRegistry);
  flowApi?.startEdit(row);
}

export async function applyAutoRuleDeleteDialogQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const row = buildRiskControlRecordRows('Auto Rules')[AUTO_RULE_OUTFLOW_DISABLED_ROW_INDEX];
  if (!row) return;

  const flowApi = await waitForShellDebugRegistry(riskControlAutoRuleFlowRegistry);
  flowApi?.requestDelete(row);
}

export async function applyAutoRuleStatusToggleDialogQa(nextEnabled: boolean) {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const row = nextEnabled
    ? buildRiskControlRecordRows('Auto Rules')[AUTO_RULE_OUTFLOW_DISABLED_ROW_INDEX]
    : buildRiskControlRecordRows('Auto Rules')[AUTO_RULE_INFLOW_ENABLED_ROW_INDEX];
  if (!row) return;

  const flowApi = await waitForShellDebugRegistry(riskControlAutoRuleFlowRegistry);
  flowApi?.requestStatusToggle(row, nextEnabled);
}

export async function applyAutoRuleNoPermissionDialogQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const overlay = await waitForShellDebugRegistry(riskControlAutoRuleOverlayRegistry);
  if (overlay) overlay.noPermissionDialogOpen.value = true;
}

export async function applyAutoRuleFormSubmitVerifyQa() {
  resetRiskControlAutoRulesQaBaseline();
  await ensureAutoRulesListPage();

  const overlay = await waitForShellDebugRegistry(riskControlAutoRuleOverlayRegistry);
  if (!overlay) return;

  closeAllAnchoredTooltipsForShellDebugScenarioReset();
  overlay.confirmCreateDirection('outflow');
  overlay.requestSubmit();
}
