import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveWebhookConfigCreatorMemberId } from './buildWebhookConfigCreatorFilterOptions';
import { resolveWebhookConfigRecordStatusFilterId } from './buildWebhookConfigRecordFilterOptions';

export function buildWebhookConfigRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    webhookCreator: resolveWebhookConfigCreatorMemberId(row.logOperatorName),
    webhookStatus: resolveWebhookConfigRecordStatusFilterId(row.ruleEnabled),
    webhookCreatedTime: row.createdAt,
  };
}
