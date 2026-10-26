import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { RISK_CONTROL_AUTO_RULES_PAGE_KEY } from '../pageKeys';
import {
  applyAutoRuleCreateFormQa,
  applyAutoRuleDeleteDialogQa,
  applyAutoRuleEditBlockedDialogQa,
  applyAutoRuleEditDisabledOutflowQa,
  applyAutoRuleFormSubmitVerifyQa,
  applyAutoRuleInflowDetailQa,
  applyAutoRuleNoPermissionDialogQa,
  applyAutoRuleOutflowDetailQa,
  applyAutoRuleStatusToggleDialogQa,
  applyRiskControlAutoRulesListBaselineQa,
} from './actions';

export const RISK_CONTROL_AUTO_RULES_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'risk-control-auto-rule-list-baseline',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 列表基线',
    description: '关闭详情、配置表单与各 Dialog/Verify，停留在自动规则列表。',
    apply: () => {
      void applyRiskControlAutoRulesListBaselineQa();
    },
  },
  {
    id: 'risk-control-auto-rule-outflow-detail',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 出款详情',
    description: '打开第一条出款方向自动规则详情，展示出款触发条件与 Elliptic 配置字段。',
    apply: () => {
      void applyAutoRuleOutflowDetailQa();
    },
  },
  {
    id: 'risk-control-auto-rule-inflow-detail',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 入款详情',
    description: '打开第一条入款方向自动规则详情，展示入款触发类型与筛查配置。',
    apply: () => {
      void applyAutoRuleInflowDetailQa();
    },
  },
  {
    id: 'risk-control-auto-rule-create-outflow',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 创建（出款）',
    description: '整页创建表单 · 出款方向默认草稿（motion-page create）。',
    apply: () => {
      void applyAutoRuleCreateFormQa('outflow');
    },
  },
  {
    id: 'risk-control-auto-rule-create-inflow',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 创建（入款）',
    description: '整页创建表单 · 入款方向默认草稿。',
    apply: () => {
      void applyAutoRuleCreateFormQa('inflow');
    },
  },
  {
    id: 'risk-control-auto-rule-edit-outflow-disabled',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 编辑（已停用出款）',
    description: '直接打开已停用出款规则的编辑配置页（无需先停用确认）。',
    apply: () => {
      void applyAutoRuleEditDisabledOutflowQa();
    },
  },
  {
    id: 'risk-control-auto-rule-edit-blocked-dialog',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 编辑拦截（启用中）',
    description: '对启用中的入款规则点编辑：弹出「需先停用」确认 Dialog。',
    apply: () => {
      void applyAutoRuleEditBlockedDialogQa();
    },
  },
  {
    id: 'risk-control-auto-rule-delete-dialog',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 删除确认',
    description: '打开删除确认 EgDialog（后续可走交易密码 Verify）。',
    apply: () => {
      void applyAutoRuleDeleteDialogQa();
    },
  },
  {
    id: 'risk-control-auto-rule-enable-toggle-dialog',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 启用确认',
    description: '对已停用的出款规则发起启用：展示含查询费用的确认文案。',
    apply: () => {
      void applyAutoRuleStatusToggleDialogQa(true);
    },
  },
  {
    id: 'risk-control-auto-rule-disable-toggle-dialog',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 停用确认',
    description: '对启用中的入款规则发起停用：展示停用确认 Dialog。',
    apply: () => {
      void applyAutoRuleStatusToggleDialogQa(false);
    },
  },
  {
    id: 'risk-control-auto-rule-no-permission-dialog',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 无创建权限',
    description: '模拟无创建权限时的 EgDialog（与列表「新增」拦截一致）。',
    apply: () => {
      void applyAutoRuleNoPermissionDialogQa();
    },
  },
  {
    id: 'risk-control-auto-rule-create-verify',
    pageKey: RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    label: '自动规则 · 创建提交验证',
    description: '打开出款创建页并直接进入交易密码 Verify（mock 111111）。',
    apply: () => {
      void applyAutoRuleFormSubmitVerifyQa();
    },
  },
];

export function registerRiskControlAutoRulesQaPack() {
  replaceShellDebugScenariosForPage(
    RISK_CONTROL_AUTO_RULES_PAGE_KEY,
    RISK_CONTROL_AUTO_RULES_QA_SCENARIOS,
  );
}
