import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM } from '@/scenes/manage/manageMenuData';
import { webhookPushRecords } from '@/scenes/manage/webhook/webhookStore';
import { clearQaLoadingTimeout } from './commonScenarioActions';

/** Showcase 第 2 行（index 1）为「重推中」演示位。 */
export const WEBHOOK_PUSH_RETRYING_SHOWCASE_ROW_INDEX = 1;

export function resetWebhookPushScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();
}

/** 将推送记录设为「重推中」，触发列表 1/3 → 2/3 → 3/3 动画。 */
export function applyWebhookPushRetryingScenario() {
  resetWebhookPushScenarioBaseline();

  const row =
    webhookPushRecords.value[WEBHOOK_PUSH_RETRYING_SHOWCASE_ROW_INDEX]
    ?? webhookPushRecords.value[0];
  if (!row) return;

  row.pushStatus = 'retrying';
  row.retryAttempt = undefined;
  row.manuallyRetried = false;
  row.failureReasonKey = 'Webhook push failed: connection timed out';
  row.pushAttemptCount = Math.max(row.pushAttemptCount, 2);
}

export const WEBHOOK_PUSH_RECORDS_PAGE_KEY =
  `Manage:${MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM}` as const;
