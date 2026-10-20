import { ref, shallowRef } from 'vue';
import type { WebhookEndpointVerifyButtonOutcome } from './webhookEndpointVerifyFlow';

/** Shell Debug QA · Webhook 创建/编辑表单预置（仅 DEV 场景注入）。 */
export type WebhookCreateFormQaPatch = {
  name?: string;
  endpointUrl?: string;
  eventSelected?: boolean;
  nameBlurred?: boolean;
  endpointBlurred?: boolean;
  /** 创建按钮可点（不预置按钮下方验证文案）。 */
  endpointVerifiedForSubmit?: boolean;
  /** 仅 DEV 强制预览按钮下方结果；正常流程须用户点击「端点验证」。 */
  endpointVerifyButtonOutcome?: WebhookEndpointVerifyButtonOutcome;
};

export const webhookCreateFormQaPatch = shallowRef<WebhookCreateFormQaPatch | null>(null);
export const webhookCreateFormQaNonce = ref(0);

export function applyWebhookCreateFormQaPatch(patch: WebhookCreateFormQaPatch) {
  webhookCreateFormQaPatch.value = patch;
  webhookCreateFormQaNonce.value += 1;
}
