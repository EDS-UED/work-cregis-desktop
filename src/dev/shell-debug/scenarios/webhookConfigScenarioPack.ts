import { replaceShellDebugScenariosForPage } from '../registry';
import {
  WEBHOOK_CONFIG_PAGE_KEY,
  applyWebhookCreateEndpointHttpScenario,
  applyWebhookCreateEndpointVerifyPassedScenario,
  applyWebhookCreatedKeyDialogScenario,
  applyWebhookCreateNameInvalidScenario,
  applyWebhookCreateNameLengthScenario,
  buildWebhookVerifyErrorQaScenarios,
} from './webhookConfigScenarioActions';

export const MANAGE_WEBHOOK_CONFIG_SCENARIOS = [
  {
    id: 'manage-webhook-create-name-invalid',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: 'Webhook名称（含空格报错）',
    description: '仅名称区：含空格且已失焦，展示「请输入有效的 Webhook 名称」；其余字段空白。',
    apply: applyWebhookCreateNameInvalidScenario,
  },
  {
    id: 'manage-webhook-create-name-length',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: 'Webhook名称（长度不足报错）',
    description: '仅名称区：1 字且已失焦，展示长度 danger；其余字段空白。',
    apply: applyWebhookCreateNameLengthScenario,
  },
  {
    id: 'manage-webhook-create-endpoint-http',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '端点URL（非 HTTPS 报错）',
    description: '仅端点 URL 区：http:// 且已失焦，展示 URL 格式错误；其余字段空白。',
    apply: applyWebhookCreateEndpointHttpScenario,
  },
  {
    id: 'manage-webhook-create-verify-passed',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '端点验证（验证通过）',
    description: '仅端点验证区：按钮「验证通过」成功填充态且不可再点；端点 URL 等其余字段保持空白。',
    apply: applyWebhookCreateEndpointVerifyPassedScenario,
  },
  {
    id: 'manage-webhook-create-created-key-dialog',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '已创建（Webhook 密钥弹窗）',
    description:
      '打开「Webhook 已创建」EgBusinessDialog（HMAC 说明 + URL/Team/Secret 复制与 Secret 查看）；不写入列表、不打开创建页。',
    apply: applyWebhookCreatedKeyDialogScenario,
  },
  ...buildWebhookVerifyErrorQaScenarios(),
];

export function registerWebhookConfigScenarioPack() {
  replaceShellDebugScenariosForPage(
    WEBHOOK_CONFIG_PAGE_KEY,
    MANAGE_WEBHOOK_CONFIG_SCENARIOS,
  );
}

registerWebhookConfigScenarioPack();
