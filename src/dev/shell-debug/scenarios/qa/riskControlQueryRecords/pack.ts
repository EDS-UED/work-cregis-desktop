import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { RISK_CONTROL_QUERY_RECORDS_PAGE_KEY } from '../pageKeys';
import { RISK_CONTROL_QUERY_RECORDS_EXCEPTION_HANDLING_QA_CHECKLIST } from './exceptionHandlingChecklist';
import {
  applyAmlDesignatedHandlerExceptionDetailQa,
  applyAmlExceptionHandlingResolvedPreviewQa,
  applyAmlQueryRecordDetailQa,
} from './actions';

export const RISK_CONTROL_QUERY_RECORDS_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'risk-control-aml-outflow-danger-detail',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 出款自动查询成功',
    description:
      '打开 AML-00001 详情：Headline 顶端卡片 + 查询结果 Tab（风险画像 / 处理建议 / 交易对手）。',
    apply: () => applyAmlQueryRecordDetailQa(0, 0),
  },
  {
    id: 'risk-control-aml-designated-handler-exception',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 重新查询（放行/驳回后变更状态）',
    description:
      '打开 AML-00003 详情（查询结果 Tab）：异常摘要与「处理方式」；完成重新查询 / 放行 / 驳回后列表风险评级与详情按钮状态随之变更。',
    apply: applyAmlDesignatedHandlerExceptionDetailQa,
  },
  {
    id: 'risk-control-aml-exception-handling-resolved-qa',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: 'QA · 异常已处置（按钮禁用 + 列表评级）',
    description: RISK_CONTROL_QUERY_RECORDS_EXCEPTION_HANDLING_QA_CHECKLIST.join(' '),
    apply: () => applyAmlExceptionHandlingResolvedPreviewQa('pass'),
  },
];

export function registerRiskControlQueryRecordsQaPack() {
  replaceShellDebugScenariosForPage(
    RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    RISK_CONTROL_QUERY_RECORDS_QA_SCENARIOS,
  );
}
