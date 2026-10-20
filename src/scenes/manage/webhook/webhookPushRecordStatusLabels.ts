import type { TagStatus } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type WebhookPushRecordStatusKey = 'success' | 'failed' | 'retrying';

export function resolveWebhookPushRecordStatusKey(
  row: PaymentEngineRecordRow,
): WebhookPushRecordStatusKey {
  const key = row.webhookPushStatusKey;
  if (key === 'success' || key === 'failed' || key === 'retrying') return key;
  return 'failed';
}

export function resolveWebhookPushRecordStatusTagStatus(
  statusKey: WebhookPushRecordStatusKey,
): TagStatus {
  if (statusKey === 'success') return 'success';
  if (statusKey === 'retrying') return 'warning';
  return 'danger';
}

export function resolveWebhookPushRecordStatusLabelKey(
  statusKey: WebhookPushRecordStatusKey,
): string {
  if (statusKey === 'success') return 'Success';
  if (statusKey === 'retrying') return 'Retrying';
  return 'Failed';
}
