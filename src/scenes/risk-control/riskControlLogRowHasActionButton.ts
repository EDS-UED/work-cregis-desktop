import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export const RISK_CONTROL_LOG_ACTION_PLACEHOLDER = '--';

const POLICY_ACTIONS_WITHOUT_BUTTON = new Set([
  'enabled Policy',
]);

const AUTOMATION_ACTIONS_WITH_BUTTON = new Set([
  'created Automation',
  'edited Automation',
  'send transaction triggered Automation',
  'withdraw triggered Automation',
]);

const TEAM_API_ACTIONS_WITH_BUTTON = new Set([
  'created API',
  'upgraded API',
]);

/** 风控日志 · Action 列是否展示 View 按钮（否则显示 `--`）。 */
export function riskControlLogRowHasActionButton(
  row: Pick<PaymentEngineRecordRow, 'logTypeKey' | 'logActionKey'>,
): boolean {
  const logTypeKey = row.logTypeKey ?? 'Policy';
  const logActionKey = row.logActionKey ?? '';

  if (logTypeKey === 'AML') {
    return false;
  }

  if (logTypeKey === 'Automation') {
    return AUTOMATION_ACTIONS_WITH_BUTTON.has(logActionKey);
  }

  if (logTypeKey === 'Team API') {
    return TEAM_API_ACTIONS_WITH_BUTTON.has(logActionKey);
  }

  if (logTypeKey === 'Policy') {
    return !POLICY_ACTIONS_WITHOUT_BUTTON.has(logActionKey);
  }

  return true;
}
