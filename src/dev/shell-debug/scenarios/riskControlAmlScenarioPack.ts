import { replaceShellDebugScenariosForPage } from '../registry';
import {
  RISK_CONTROL_AML_QUERY_RECORDS_PAGE_KEY,
  RISK_CONTROL_AUTO_RULES_PAGE_KEY,
  applyAmlDesignatedHandlerExceptionDetailScenario,
  applyAutoRuleOutflowDetailScenario,
} from './riskControlAmlScenarioActions';

export const RISK_CONTROL_AML_SCENARIOS = [
  {
    id: 'risk-control-aml-designated-handler-exception',
    pageKey: RISK_CONTROL_AML_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 指定处理人异常',
    description:
      '打开 AML-00003 详情（查询结果 Tab），展示异常摘要与「处理方式」区块（重新查询 / 放行 / 驳回）。',
    apply: applyAmlDesignatedHandlerExceptionDetailScenario,
  },
  {
    id: 'risk-control-auto-rule-outflow-detail',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 出款详情',
    description: '打开第一条出款方向自动规则详情，展示出款触发条件与 Elliptic 配置字段。',
    apply: applyAutoRuleOutflowDetailScenario,
  },
];

export function registerRiskControlAmlScenarioPack() {
  replaceShellDebugScenariosForPage(RISK_CONTROL_AML_QUERY_RECORDS_PAGE_KEY, [
    RISK_CONTROL_AML_SCENARIOS[0]!,
  ]);
  replaceShellDebugScenariosForPage(RISK_CONTROL_AUTO_RULES_PAGE_KEY, [
    RISK_CONTROL_AML_SCENARIOS[1]!,
  ]);
}

registerRiskControlAmlScenarioPack();
