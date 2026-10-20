import { shallowRef } from 'vue';

export type WebhookModuleShellApi = {
  openCreateForm: () => void;
  /** Shell Debug · 「Webhook 已创建」密钥弹窗预览。 */
  openWebhookCreatedKeyDialog: () => void;
};

export const webhookModuleShellApiRegistry = shallowRef<WebhookModuleShellApi | null>(null);

export function registerWebhookModuleShellApi(api: WebhookModuleShellApi | null) {
  webhookModuleShellApiRegistry.value = api;
}
