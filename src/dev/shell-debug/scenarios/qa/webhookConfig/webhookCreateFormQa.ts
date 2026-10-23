import { ref, shallowRef } from 'vue';
import type { WebhookEndpointVerifyButtonOutcome } from '@/scenes/manage/webhook/webhookEndpointVerifyFlow';

/** Shell Debug QA · Webhook 创建/编辑表单预置。 */
export type WebhookCreateFormQaPatch = {
  name?: string;
  endpointUrl?: string;
  eventSelected?: boolean;
  nameBlurred?: boolean;
  endpointBlurred?: boolean;
  endpointVerifiedForSubmit?: boolean;
  endpointVerifyButtonOutcome?: WebhookEndpointVerifyButtonOutcome;
};

export const webhookCreateFormQaPatch = shallowRef<WebhookCreateFormQaPatch | null>(null);
export const webhookCreateFormQaNonce = ref(0);

export function applyWebhookCreateFormQaPatch(patch: WebhookCreateFormQaPatch) {
  webhookCreateFormQaPatch.value = patch;
  webhookCreateFormQaNonce.value += 1;
}
