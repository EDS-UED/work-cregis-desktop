import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveWebhookPushRecordEventFilterId,
  resolveWebhookPushRecordStatusFilterId,
} from './buildWebhookPushRecordFilterOptions';

export function buildWebhookPushRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    webhookPushEvent: resolveWebhookPushRecordEventFilterId(row.webhookEventKey),
    webhookPushStatus: resolveWebhookPushRecordStatusFilterId(row.webhookPushStatusKey),
    webhookPushTime: row.createdAt,
  };
}
