import type { TagStatus } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type WebhookPushRecordStatusKey = 'success' | 'failed';

export function resolveWebhookPushRecordStatusKey(
  row: PaymentEngineRecordRow,
): WebhookPushRecordStatusKey {
  const key = row.webhookPushStatusKey;
  if (key === 'success' || key === 'failed') return key;
  return 'failed';
}

export function resolveWebhookPushRecordStatusTagStatus(
  statusKey: WebhookPushRecordStatusKey,
): TagStatus {
  if (statusKey === 'success') return 'success';
  return 'danger';
}

export function resolveWebhookPushRecordStatusLabelKey(
  statusKey: WebhookPushRecordStatusKey,
): string {
  if (statusKey === 'success') return 'Success';
  return 'Failed';
}
