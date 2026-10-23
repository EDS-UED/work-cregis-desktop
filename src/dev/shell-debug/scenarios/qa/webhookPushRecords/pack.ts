import { replaceShellDebugScenariosForPage } from '../../../registry';
import { WEBHOOK_PUSH_RECORDS_PAGE_KEY } from '../pageKeys';

/** 推送记录页 QA 场景（当前无注册项；在此 pack 扩展）。 */
export function registerWebhookPushRecordsQaPack() {
  replaceShellDebugScenariosForPage(WEBHOOK_PUSH_RECORDS_PAGE_KEY, []);
}
