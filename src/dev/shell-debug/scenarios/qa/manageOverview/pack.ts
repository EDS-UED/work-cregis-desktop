import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { MANAGE_OVERVIEW_PAGE_KEY } from '../pageKeys';
import {
  applyManageOverviewGasNotEnabledQa,
  applyManageOverviewGasProxyNoPermissionDialogQa,
  applyManageOverviewGasProxySetPasswordDialogQa,
} from './actions';

export const MANAGE_OVERVIEW_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'manage-overview-gas-not-enabled',
    pageKey: MANAGE_OVERVIEW_PAGE_KEY,
    label: '总览 · 未开通 Gas 账户（仅 TRX）',
    description:
      '未开通 Gas：隐藏 Gas 摘要卡片与 ETH/BNB/POL/SOL 行；仅保留 TRX Gas 行。',
    apply: () => {
      void applyManageOverviewGasNotEnabledQa();
    },
  },
  {
    id: 'manage-overview-gas-proxy-no-permission-dialog',
    pageKey: MANAGE_OVERVIEW_PAGE_KEY,
    label: '总览 · 矿工费代付（无权限提醒弹窗）',
    description: 'EgDialog 标准提醒：无矿工费代付配置权限。',
    apply: () => {
      void applyManageOverviewGasProxyNoPermissionDialogQa();
    },
  },
  {
    id: 'manage-overview-gas-proxy-set-password-dialog',
    pageKey: MANAGE_OVERVIEW_PAGE_KEY,
    label: '总览 · 矿工费代付（先设交易密码）',
    description: 'EgDialog 提醒：开启代付前需先设置交易密码。',
    apply: () => {
      void applyManageOverviewGasProxySetPasswordDialogQa();
    },
  },
];

export function registerManageOverviewQaPack() {
  replaceShellDebugScenariosForPage(MANAGE_OVERVIEW_PAGE_KEY, MANAGE_OVERVIEW_QA_SCENARIOS);
}
