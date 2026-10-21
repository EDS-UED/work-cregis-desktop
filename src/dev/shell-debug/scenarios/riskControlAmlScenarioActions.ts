import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export const RISK_CONTROL_AML_QUERY_RECORDS_PAGE_KEY = 'Risk Control:Query Records' as const;
export const RISK_CONTROL_AUTO_RULES_PAGE_KEY = 'Risk Control:Auto Rules' as const;

/** 指定处理人 · 查询异常（AML-00002，列表第 2 行）。 */
export const AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX = 1;

export function resetRiskControlAmlScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

export async function applyAmlQueryRecordDetailScenario(rowIndex: number, tabIndex = 0) {
  resetRiskControlAmlScenarioBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildRiskControlRecordRows('Query Records')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Query Records', tabIndex);
}

export function applyAmlDesignatedHandlerExceptionDetailScenario() {
  applyAmlQueryRecordDetailScenario(AML_DESIGNATED_HANDLER_EXCEPTION_ROW_INDEX, 0);
}

export async function applyAutoRuleOutflowDetailScenario(rowIndex = 0) {
  resetRiskControlAmlScenarioBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const rows = buildRiskControlRecordRows('Auto Rules');
  const row = rows.find((entry) => entry.autoRuleDirection === 'outflow') ?? rows[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Auto Rules', 0);
}
