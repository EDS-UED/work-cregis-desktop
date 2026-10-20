import { replaceShellDebugScenariosForPage } from '../registry';
import {
  RISK_CONTROL_LOGS_PAGE_KEY,
  applyRiskControlLogsFilterGuideResetScenario,
} from './riskControlLogsScenarioActions';

export const RISK_CONTROL_LOGS_SCENARIOS = [
  {
    id: 'risk-control-logs-filter-guide-reset',
    pageKey: RISK_CONTROL_LOGS_PAGE_KEY,
    label: '引导（进入日志页面时）',
    description:
      '清除筛选引导的「已看过」标记；停留在日志页或再次进入「日志」时会重新展示 EgGuidancePopover。',
    apply: applyRiskControlLogsFilterGuideResetScenario,
  },
];

export function registerRiskControlLogsScenarioPack() {
  replaceShellDebugScenariosForPage(RISK_CONTROL_LOGS_PAGE_KEY, RISK_CONTROL_LOGS_SCENARIOS);
}

registerRiskControlLogsScenarioPack();
