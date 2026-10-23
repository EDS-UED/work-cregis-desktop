import { ref } from 'vue';
import {
  buildInitialWebhookConfigs,
  buildInitialWebhookPushRecords,
  type WebhookConfigRecord,
  type WebhookPushRecord,
} from './webhookMockData';

export const webhookConfigs = ref<WebhookConfigRecord[]>(buildInitialWebhookConfigs());
export const webhookPushRecords = ref<WebhookPushRecord[]>(buildInitialWebhookPushRecords());

export function findWebhookConfigById(id: string): WebhookConfigRecord | undefined {
  return webhookConfigs.value.find((row) => row.id === id);
}

export function updateWebhookConfigEnabled(id: string, enabled: boolean) {
  const row = findWebhookConfigById(id);
  if (row) row.enabled = enabled;
}

export function removeWebhookConfig(id: string) {
  webhookConfigs.value = webhookConfigs.value.filter((row) => row.id !== id);
}

export function addWebhookConfig(record: WebhookConfigRecord) {
  webhookConfigs.value = [record, ...webhookConfigs.value];
}

export function updateWebhookConfig(record: WebhookConfigRecord) {
  const index = webhookConfigs.value.findIndex((row) => row.id === record.id);
  if (index >= 0) {
    webhookConfigs.value.splice(index, 1, record);
  }
}

export function markPushRecordRetried(id: string) {
  const row = webhookPushRecords.value.find((item) => item.id === id);
  if (!row) return;
  row.manuallyRetried = true;
  row.pushStatus = 'success';
  row.lastPushAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  row.pushAttemptCount += 1;
  row.failureReasonKey = undefined;
}
