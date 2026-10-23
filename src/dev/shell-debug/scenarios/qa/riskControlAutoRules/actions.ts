import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import { waitForPaymentEngineDetailFlow } from '../../waitForPaymentEngineDetailFlow';
import { resetRiskControlQueryRecordsQaBaseline } from '../riskControlQueryRecords/actions';

export async function applyAutoRuleOutflowDetailQa(rowIndex = 0) {
  resetRiskControlQueryRecordsQaBaseline();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const rows = buildRiskControlRecordRows('Auto Rules');
  const row = rows.find((entry) => entry.autoRuleDirection === 'outflow') ?? rows[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Auto Rules', 0);
}
