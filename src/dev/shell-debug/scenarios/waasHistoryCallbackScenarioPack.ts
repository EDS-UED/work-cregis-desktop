import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import {
  applyWaasHistoryCallbackIgnoreStatusTabScenario,
  applyWaasHistoryCallbackNormalStatusTabScenario,
  applyWaasHistoryCallbackOrderRelatedTabScenario,
  applyWaasHistoryCallbackWalletPayoutRelatedTabScenario,
} from './waasHistoryCallbackScenarioActions';

export const WAAS_HISTORY_CALLBACK_DETAIL_SCENARIOS = [
  {
    id: 'waas-history-callback-detail-ignore-status',
    pageKey: 'WaaS:History Callback' as const,
    label: '详情 · 回调 Tab（忽略）',
    description: '第 1 行提币 · 回调 Tab：状态忽略 / 自动推送 / 过滤原因。',
    apply: applyWaasHistoryCallbackIgnoreStatusTabScenario,
  },
  {
    id: 'waas-history-callback-detail-normal-status',
    pageKey: 'WaaS:History Callback' as const,
    label: '详情 · 回调 Tab（正常）',
    description: '第 2 行订单记录 · 回调 Tab：状态正常 / 自动推送 / 过滤原因。',
    apply: applyWaasHistoryCallbackNormalStatusTabScenario,
  },
  {
    id: 'waas-history-callback-detail-order-related',
    pageKey: 'WaaS:History Callback' as const,
    label: '详情 · 订单相关',
    description: '第 2 行订单记录 · 订单相关 Tab：订单编号 / 商户单号 / 回调事件 / 需补款 / 交易哈希。',
    apply: applyWaasHistoryCallbackOrderRelatedTabScenario,
  },
  {
    id: 'waas-history-callback-detail-wallet-payout-related',
    pageKey: 'WaaS:History Callback' as const,
    label: '详情 · 钱包提币',
    description:
      '第 1 行提币 · 钱包提币 Tab：钱包 / 提币单号 / 第三方业务单号 / 交易状态 / 收发方 / 交易哈希 / 备注。',
    apply: applyWaasHistoryCallbackWalletPayoutRelatedTabScenario,
  },
];

export function registerWaasHistoryCallbackScenarioPack() {
  replaceShellDebugScenariosForPage('WaaS:History Callback', [
    createWaasOrderModeBusinessScenario('WaaS:History Callback'),
    ...WAAS_HISTORY_CALLBACK_DETAIL_SCENARIOS,
  ]);
}

registerWaasHistoryCallbackScenarioPack();
