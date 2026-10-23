import { registerRiskControlAutoRulesQaPack } from './riskControlAutoRules/pack';
import { registerRiskControlQueryRecordsQaPack } from './riskControlQueryRecords/pack';
import { registerWebhookConfigQaPack } from './webhookConfig/pack';
import { registerWebhookPushRecordsQaPack } from './webhookPushRecords/pack';
import { registerTasksQaPacks } from './tasks/pack';

/** 查询记录 / 自动规则 / Webhook 配置 / 推送记录 / 协作 · QA 场景统一注册。 */
export function registerModuleQaScenarioPacks() {
  registerRiskControlQueryRecordsQaPack();
  registerRiskControlAutoRulesQaPack();
  registerWebhookConfigQaPack();
  registerWebhookPushRecordsQaPack();
  registerTasksQaPacks();
}

registerModuleQaScenarioPacks();
