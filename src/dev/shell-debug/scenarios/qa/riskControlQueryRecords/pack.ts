import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { RISK_CONTROL_QUERY_RECORDS_PAGE_KEY } from '../pageKeys';
import { RISK_CONTROL_QUERY_RECORDS_EXCEPTION_HANDLING_QA_CHECKLIST } from './exceptionHandlingChecklist';
import { RISK_CONTROL_QUERY_RECORDS_MANUAL_REVIEW_QA_CHECKLIST } from './manualReviewChecklist';
import {
  applyAmlDesignatedHandlerExceptionDetailQa,
  applyAmlExceptionHandlingResolvedPreviewQa,
  applyAmlManualQueryCreateFormQa,
  applyAmlManualReviewDangerHeadlineQa,
  applyAmlQueryRecordDetailQa,
  applyAmlQueryRecordDetailTabKindQa,
  applyRiskControlQueryRecordsListBaselineQa,
  AML_OUTFLOW_DANGER_ROW_INDEX,
  AML_QUERY_FAILED_ROW_INDEX,
  AML_SUSPICIOUS_ROW_INDEX,
} from './actions';

export const RISK_CONTROL_QUERY_RECORDS_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'risk-control-aml-list-baseline',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 列表基线',
    description: '关闭详情与手动查询表单，清空 AML 查询 patch，停留在查询记录列表。',
    apply: () => {
      void applyRiskControlQueryRecordsListBaselineQa();
    },
  },
  {
    id: 'risk-control-aml-outflow-danger-detail',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 出款自动查询成功',
    description:
      '打开 AML-00001 详情：Headline 顶端卡片 + 查询结果 Tab（风险画像 / 处理建议 / 交易对手）。',
    apply: () => applyAmlQueryRecordDetailQa(AML_OUTFLOW_DANGER_ROW_INDEX, 0),
  },
  {
    id: 'risk-control-aml-suspicious-detail',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 可疑评级详情',
    description: '打开 AML-00002 详情（查询结果 Tab）：可疑评级与 3.6 分展示。',
    apply: () => applyAmlQueryRecordDetailQa(AML_SUSPICIOUS_ROW_INDEX, 0),
  },
  {
    id: 'risk-control-aml-query-failed-detail',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 查询失败详情',
    description: '打开 AML-00004 详情：查询失败 Headline（NA）与查询结果空态。',
    apply: () => applyAmlQueryRecordDetailQa(AML_QUERY_FAILED_ROW_INDEX, 0),
  },
  {
    id: 'risk-control-aml-risk-trace-tab',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 风险溯源 Tab',
    description: 'AML-00001 详情切换到「风险溯源」Tab（交易对手风险）。',
    apply: () => {
      void applyAmlQueryRecordDetailTabKindQa(AML_OUTFLOW_DANGER_ROW_INDEX, 'riskTrace');
    },
  },
  {
    id: 'risk-control-aml-audit-log-tab',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 审核日志 Tab',
    description: 'AML-00001 详情切换到「审核日志」Tab。',
    apply: () => {
      void applyAmlQueryRecordDetailTabKindQa(AML_OUTFLOW_DANGER_ROW_INDEX, 'queryDetail');
    },
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
    id: 'risk-control-aml-exception-handling-resolved-pass',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: 'QA · 异常已处置（放行）',
    description: RISK_CONTROL_QUERY_RECORDS_EXCEPTION_HANDLING_QA_CHECKLIST.join(' '),
    apply: () => applyAmlExceptionHandlingResolvedPreviewQa('pass'),
  },
  {
    id: 'risk-control-aml-exception-handling-resolved-retry',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: 'QA · 异常已处置（重新查询）',
    description:
      '预置 AML-00003 已完成「重新查询」处置：列表评级为危险及分数；详情内处置按钮禁用。',
    apply: () => applyAmlExceptionHandlingResolvedPreviewQa('retry'),
  },
  {
    id: 'risk-control-aml-exception-handling-resolved-reject',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: 'QA · 异常已处置（驳回）',
    description:
      '预置 AML-00003 已完成「驳回」处置：列表评级为已处理；详情内处置按钮禁用。',
    apply: () => applyAmlExceptionHandlingResolvedPreviewQa('reject'),
  },
  {
    id: 'risk-control-aml-manual-review-headline',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: 'QA · 人工审核后 Headline',
    description: RISK_CONTROL_QUERY_RECORDS_MANUAL_REVIEW_QA_CHECKLIST.join(' '),
    apply: () => {
      void applyAmlManualReviewDangerHeadlineQa();
    },
  },
  {
    id: 'risk-control-aml-manual-query-create',
    pageKey: RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    label: '查询记录 · 手动查询创建页',
    description: '打开整页手动查询表单（LayoutChrome 配置页 motion）。',
    apply: () => {
      void applyAmlManualQueryCreateFormQa();
    },
  },
];

export function registerRiskControlQueryRecordsQaPack() {
  replaceShellDebugScenariosForPage(
    RISK_CONTROL_QUERY_RECORDS_PAGE_KEY,
    RISK_CONTROL_QUERY_RECORDS_QA_SCENARIOS,
  );
}
