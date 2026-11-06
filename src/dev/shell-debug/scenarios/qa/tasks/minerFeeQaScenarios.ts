import type { ShellDebugScenario } from '../../../registry';
import {
  applyTaskMinerFeeBitcoinNormalSigningQa,
  applyTaskMinerFeeEvmAddressPaymentSigningQa,
  applyTaskMinerFeeEvmGasInsufficientSigningQa,
  applyTaskMinerFeeEvmNormalSigningQa,
  applyTaskMinerFeeTonNormalSigningQa,
  applyTaskMinerFeeTronInactiveRecipientSigningQa,
  applyTaskMinerFeeTronNormalSigningQa,
  applyTaskMinerFeeTronTeamBalanceInsufficientSigningQa,
} from './actions';
import { TASKS_SIGNING_PAGE_KEY } from './pageKeys';

const MINER_FEE_QA_OPEN_HINT =
  '打开对应列表行详情 → 底栏「签名」→ 矿工费 Popover';

/** 待签名 · 矿工费四网 QA（与 `MINER_FEE_QA_SIGNING_ROW` mock 对齐）。 */
export const TASKS_MINER_FEE_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'tasks-miner-fee-bitcoin-normal',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · Bitcoin（正常）',
    description: `${MINER_FEE_QA_OPEN_HINT} · BTC 档位列表，无异常反馈。`,
    apply: applyTaskMinerFeeBitcoinNormalSigningQa,
  },
  {
    id: 'tasks-miner-fee-evm-normal',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · EVM（正常）',
    description: `${MINER_FEE_QA_OPEN_HINT} · 支付方式步代付 Gas 余额充足，无「余额不足」。`,
    apply: applyTaskMinerFeeEvmNormalSigningQa,
  },
  {
    id: 'tasks-miner-fee-evm-gas-insufficient',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · EVM（余额不足）',
    description: `${MINER_FEE_QA_OPEN_HINT} · 第 12 条 USDT → 支付方式 → 代付 Gas 下应显示「余额不足，请充值」。`,
    apply: applyTaskMinerFeeEvmGasInsufficientSigningQa,
  },
  {
    id: 'tasks-miner-fee-evm-address-payment',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · EVM（未开启代付）',
    description: `${MINER_FEE_QA_OPEN_HINT} · 第 5 条 USDT（BNB Smart Chain）· 无支付方式步，直接进入 EVM 费率档位列表。`,
    apply: applyTaskMinerFeeEvmAddressPaymentSigningQa,
  },
  {
    id: 'tasks-miner-fee-ton-normal',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · The Open Network（正常）',
    description: `${MINER_FEE_QA_OPEN_HINT} · TON 面板，无异常反馈。`,
    apply: applyTaskMinerFeeTonNormalSigningQa,
  },
  {
    id: 'tasks-miner-fee-tron-normal',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · Tron（正常）',
    description: `${MINER_FEE_QA_OPEN_HINT} · TRON 面板无「接收方未激活」「团队余额不足」。`,
    apply: applyTaskMinerFeeTronNormalSigningQa,
  },
  {
    id: 'tasks-miner-fee-tron-inactive-recipient',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · Tron（接收方地址未激活）',
    description: `${MINER_FEE_QA_OPEN_HINT} · 应展示「接收方未激活」说明，无团队余额不足。`,
    apply: applyTaskMinerFeeTronInactiveRecipientSigningQa,
  },
  {
    id: 'tasks-miner-fee-tron-team-balance-insufficient',
    pageKey: TASKS_SIGNING_PAGE_KEY,
    label: '矿工费 · Tron（余额不足）',
    description: `${MINER_FEE_QA_OPEN_HINT} · 应展示「团队余额不足」+ 充值链，无接收方未激活。`,
    apply: applyTaskMinerFeeTronTeamBalanceInsufficientSigningQa,
  },
];
