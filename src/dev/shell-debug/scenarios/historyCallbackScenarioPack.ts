import { replaceShellDebugScenariosForPage } from '../registry';
import { applyHistoryCallbackManualPushTabScenario } from './historyCallbackScenarioActions';

/** 支付引擎 · 历史回调：仅保留支付引擎侧回调事件。 */
export const PAYMENT_ENGINE_HISTORY_CALLBACK_DETAIL_SCENARIOS = [
  {
    id: 'payment-engine-history-callback-detail-manual-push',
    pageKey: 'Payment Engine:History Callback' as const,
    label: '详情 · 回调 Tab（手动推送）',
    description: '第 3 行异常支付单 · 回调 Tab：状态正常 / 手动推送 / 过滤原因。',
    apply: applyHistoryCallbackManualPushTabScenario,
  },
];

export function registerHistoryCallbackScenarioPack() {
  replaceShellDebugScenariosForPage(
    'Payment Engine:History Callback',
    PAYMENT_ENGINE_HISTORY_CALLBACK_DETAIL_SCENARIOS,
  );
}

registerHistoryCallbackScenarioPack();
