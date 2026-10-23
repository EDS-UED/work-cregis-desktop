import { replaceShellDebugScenariosForPage, type ShellDebugScenario } from '../../../registry';
import { WEBHOOK_CONFIG_PAGE_KEY } from '../pageKeys';
import {
  applyWebhookCreateEndpointHttpQa,
  applyWebhookCreateEndpointVerifyPassedQa,
  applyWebhookCreatedKeyDialogQa,
  applyWebhookCreateNameInvalidQa,
  applyWebhookCreateNameLengthQa,
  buildWebhookVerifyErrorQaScenarios,
} from './actions';

export const WEBHOOK_CONFIG_QA_SCENARIOS: ShellDebugScenario[] = [
  {
    id: 'manage-webhook-create-name-invalid',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: 'Webhook名称（含 emoji 报错）',
    description: '仅名称区：含 emoji 且已失焦，展示「请输入正确的 Webhook 名称」；其余字段空白。',
    apply: applyWebhookCreateNameInvalidQa,
  },
  {
    id: 'manage-webhook-create-name-length',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: 'Webhook名称（长度不足报错）',
    description: '仅名称区：1 字且已失焦，展示长度 danger；其余字段空白。',
    apply: applyWebhookCreateNameLengthQa,
  },
  {
    id: 'manage-webhook-create-endpoint-http',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '端点URL（非 HTTPS 报错）',
    description: '仅端点 URL 区：http:// 且已失焦，展示 URL 格式错误；其余字段空白。',
    apply: applyWebhookCreateEndpointHttpQa,
  },
  {
    id: 'manage-webhook-create-verify-passed',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '端点验证（验证通过）',
    description: '仅端点验证区：按钮「验证通过」成功填充态且不可再点；端点 URL 等其余字段保持空白。',
    apply: applyWebhookCreateEndpointVerifyPassedQa,
  },
  {
    id: 'manage-webhook-create-created-key-dialog',
    pageKey: WEBHOOK_CONFIG_PAGE_KEY,
    label: '已创建（Webhook 密钥弹窗）',
    description:
      '打开「Webhook 已创建」EgBusinessDialog（HMAC 说明 + URL/Team/Secret 复制与 Secret 查看）；不写入列表、不打开创建页。',
    apply: applyWebhookCreatedKeyDialogQa,
  },
  ...buildWebhookVerifyErrorQaScenarios(),
];

export function registerWebhookConfigQaPack() {
  replaceShellDebugScenariosForPage(WEBHOOK_CONFIG_PAGE_KEY, WEBHOOK_CONFIG_QA_SCENARIOS);
}
