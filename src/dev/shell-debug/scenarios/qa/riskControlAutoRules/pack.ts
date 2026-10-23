import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { RISK_CONTROL_AUTO_RULES_PAGE_KEY } from '../pageKeys';
import { applyAutoRuleOutflowDetailQa } from './actions';

export const RISK_CONTROL_AUTO_RULES_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'risk-control-auto-rule-outflow-detail',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 出款详情',
    description: '打开第一条出款方向自动规则详情，展示出款触发条件与 Elliptic 配置字段。',
    apply: applyAutoRuleOutflowDetailQa,
  },
];

export function registerRiskControlAutoRulesQaPack() {
  replaceShellDebugScenariosForPage(
    RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    RISK_CONTROL_AUTO_RULES_QA_SCENARIOS,
  );
}
