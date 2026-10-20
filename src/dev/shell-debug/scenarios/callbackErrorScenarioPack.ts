import { replaceShellDebugScenariosForPage } from '../registry';
import {
  applyCallbackErrorPaymentExceptionCallbackTabScenario,
  applyCallbackErrorPaymentExceptionRelatedTabScenario,
} from './callbackErrorScenarioActions';

/** 支付引擎 · 异常回调：仅保留支付引擎侧回调事件（异常支付单等）。 */
export const PAYMENT_ENGINE_CALLBACK_ERROR_DETAIL_SCENARIOS = [
  {
    id: 'payment-engine-callback-error-detail-callback-tab',
    pageKey: 'Payment Engine:Callback Error' as const,
    label: '详情 · 回调 Tab',
    description: '第 3 行异常支付单 · 回调 Tab：回调事件编号 / 回调 URL / 更新时间 / 异常原因。',
    apply: applyCallbackErrorPaymentExceptionCallbackTabScenario,
  },
  {
    id: 'payment-engine-callback-error-detail-payment-exception-related',
    pageKey: 'Payment Engine:Callback Error' as const,
    label: '详情 · 收款相关（异常支付单）',
    description: '第 3 行异常支付单 · 收款相关 Tab：回调事件状态为已转账。',
    apply: applyCallbackErrorPaymentExceptionRelatedTabScenario,
  },
];

export function registerCallbackErrorScenarioPack() {
  replaceShellDebugScenariosForPage(
    'Payment Engine:Callback Error',
    PAYMENT_ENGINE_CALLBACK_ERROR_DETAIL_SCENARIOS,
  );
}

registerCallbackErrorScenarioPack();
