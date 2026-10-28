import { closeAllAnchoredTooltipsForShellDebugScenarioReset } from '../shellDebugScenarioAnchoredLayers';
import { requestRiskControlLogsFilterGuideReplay } from '@/scenes/risk-control/riskControlLogsFilterGuideStorage';
import { clearQaLoadingTimeout } from './commonScenarioActions';

export const RISK_CONTROL_LOGS_PAGE_KEY = 'Risk Control:Logs' as const;

export function resetRiskControlLogsScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltipsForShellDebugScenarioReset();
}

/** 清除「已看过」标记，回到日志页后会再次自动弹出筛选引导。 */
export function applyRiskControlLogsFilterGuideResetScenario() {
  clearQaLoadingTimeout();
  requestRiskControlLogsFilterGuideReplay();
}
