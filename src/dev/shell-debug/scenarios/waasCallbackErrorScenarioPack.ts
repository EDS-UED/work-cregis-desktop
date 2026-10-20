import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import {
  applyWaasCallbackErrorCallbackTabScenario,
  applyWaasCallbackErrorOrderRelatedTabScenario,
  applyWaasCallbackErrorRefundRelatedTabScenario,
  applyWaasCallbackErrorWalletPayoutRelatedTabScenario,
} from './waasCallbackErrorScenarioActions';

export const WAAS_CALLBACK_ERROR_DETAIL_SCENARIOS = [
  {
    id: 'waas-callback-error-detail-callback-tab',
    pageKey: 'WaaS:Callback Error' as const,
    label: '详情 · 回调 Tab',
    description: '第 1 行提币 · 回调 Tab：回调事件编号 / 回调 URL / 更新时间 / 异常原因。',
    apply: applyWaasCallbackErrorCallbackTabScenario,
  },
  {
    id: 'waas-callback-error-detail-order-related',
    pageKey: 'WaaS:Callback Error' as const,
    label: '详情 · 订单相关',
    description: '第 2 行订单记录 · 订单相关 Tab：订单编号 / 商户单号 / 回调事件 / 需补款 / 交易哈希。',
    apply: applyWaasCallbackErrorOrderRelatedTabScenario,
  },
  {
    id: 'waas-callback-error-detail-refund-related',
    pageKey: 'WaaS:Callback Error' as const,
    label: '详情 · 退款相关',
    description: '第 4 行退款记录 · 退款相关 Tab：回调事件状态为退款中 / 交易哈希。',
    apply: applyWaasCallbackErrorRefundRelatedTabScenario,
  },
  {
    id: 'waas-callback-error-detail-wallet-payout-related',
    pageKey: 'WaaS:Callback Error' as const,
    label: '详情 · 钱包提币',
    description:
      '第 1 行提币 · 钱包提币 Tab：回调 / 钱包 / 提币单号 / 第三方业务单号 / 交易状态 / 收发方 / 交易哈希 / 备注。',
    apply: applyWaasCallbackErrorWalletPayoutRelatedTabScenario,
  },
];

export function registerWaasCallbackErrorScenarioPack() {
  replaceShellDebugScenariosForPage('WaaS:Callback Error', [
    createWaasOrderModeBusinessScenario('WaaS:Callback Error'),
    ...WAAS_CALLBACK_ERROR_DETAIL_SCENARIOS,
  ]);
}

registerWaasCallbackErrorScenarioPack();
