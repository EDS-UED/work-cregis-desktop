import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import { applyWaasWalletPayoutDetailScenario } from './waasWalletPayoutScenarioActions';

/** 与 `WALLET_PAYOUT_STATUS_SHOWCASE` 前 6 行一一对应。 */
const WALLET_PAYOUT_STATUS_DETAIL_SCENARIOS = [
  {
    id: 'waas-wallet-payout-detail-external-pending',
    label: '详情 · 外部待确认',
    description: '第 1 行 · 状态 Pending External Confirmation；提币时间 / 单号 / 金额 / 收发方。',
    rowIndex: 0,
  },
  {
    id: 'waas-wallet-payout-detail-approving',
    label: '详情 · 审批中',
    description: '第 2 行 · 状态 Approving。',
    rowIndex: 1,
  },
  {
    id: 'waas-wallet-payout-detail-signature-pending',
    label: '详情 · 待签名',
    description: '第 3 行 · 状态 Pending Signature。',
    rowIndex: 2,
  },
  {
    id: 'waas-wallet-payout-detail-signed-pending-confirmation',
    label: '详情 · 已签名待确认',
    description: '第 4 行 · 状态 Signed Pending Confirmation。',
    rowIndex: 3,
  },
  {
    id: 'waas-wallet-payout-detail-transaction-failed',
    label: '详情 · 交易失败',
    description: '第 5 行 · 状态 Transaction Failed。',
    rowIndex: 4,
  },
  {
    id: 'waas-wallet-payout-detail-completed',
    label: '详情 · 已完成',
    description: '第 6 行 · 状态 Transaction Completed。',
    rowIndex: 5,
  },
] as const;

export function registerWaasWalletPayoutScenarioPack() {
  replaceShellDebugScenariosForPage('WaaS:Wallet Payout', [
    createWaasOrderModeBusinessScenario('WaaS:Wallet Payout'),
    ...WALLET_PAYOUT_STATUS_DETAIL_SCENARIOS.map((scenario) => ({
      id: scenario.id,
      pageKey: 'WaaS:Wallet Payout' as const,
      label: scenario.label,
      description: scenario.description,
      apply: () => applyWaasWalletPayoutDetailScenario(scenario.rowIndex),
    })),
  ]);
}

registerWaasWalletPayoutScenarioPack();
