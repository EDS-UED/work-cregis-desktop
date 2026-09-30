import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import { applyWaasWalletPayoutDetailScenario } from './waasWalletPayoutScenarioActions';

const WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION =
  '分段：钱包 / 三方业务编号 / 发起时间｜发送方 / 接收方 /（已完成）交易哈希 / 区块 / 矿工费 / 完成时间｜回调地址 / IP地址 / 备注。';

/** 与 `WALLET_PAYOUT_STATUS_SHOWCASE` 前 7 行一一对应。 */
const WALLET_PAYOUT_STATUS_DETAIL_SCENARIOS = [
  {
    id: 'waas-wallet-payout-detail-external-pending',
    label: '详情 · 待外部确认',
    description: `第 1 行 · 状态 Pending External Confirmation；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 0,
  },
  {
    id: 'waas-wallet-payout-detail-approving',
    label: '详情 · 审批中',
    description: `第 2 行 · 状态 Approving；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 1,
  },
  {
    id: 'waas-wallet-payout-detail-signature-pending',
    label: '详情 · 待签名',
    description: `第 3 行 · 状态 Pending Signature；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 2,
  },
  {
    id: 'waas-wallet-payout-detail-signed-pending-confirmation',
    label: '详情 · 已签名，待确认',
    description: `第 4 行 · 状态 Signed Pending Confirmation；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 3,
  },
  {
    id: 'waas-wallet-payout-detail-transaction-failed',
    label: '详情 · 交易失败',
    description: `第 5 行 · 状态 Transaction Failed；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 4,
  },
  {
    id: 'waas-wallet-payout-detail-rejected',
    label: '详情 · 驳回',
    description: `第 6 行 · 状态 Reject；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 5,
  },
  {
    id: 'waas-wallet-payout-detail-completed',
    label: '详情 · 已完成',
    description: `第 7 行 · 状态 Transaction Completed；${WALLET_PAYOUT_DETAIL_FIELD_DESCRIPTION}`,
    rowIndex: 6,
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
