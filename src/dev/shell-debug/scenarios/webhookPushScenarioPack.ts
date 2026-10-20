import { replaceShellDebugScenariosForPage } from '../registry';
import {
  WEBHOOK_PUSH_RECORDS_PAGE_KEY,
  applyWebhookPushRetryingScenario,
} from './webhookPushScenarioActions';

export const MANAGE_WEBHOOK_PUSH_RECORDS_SCENARIOS = [
  {
    id: 'manage-webhook-push-records-retrying',
    pageKey: WEBHOOK_PUSH_RECORDS_PAGE_KEY,
    label: '推送状态（重推中）',
    description:
      '第 2 行设为重推中：列表展示 warning Tag「重试中 1/3」，每 1 秒递增，走满后变为成功。',
    apply: applyWebhookPushRetryingScenario,
  },
];

export function registerWebhookPushScenarioPack() {
  replaceShellDebugScenariosForPage(
    WEBHOOK_PUSH_RECORDS_PAGE_KEY,
    MANAGE_WEBHOOK_PUSH_RECORDS_SCENARIOS,
  );
}

registerWebhookPushScenarioPack();
