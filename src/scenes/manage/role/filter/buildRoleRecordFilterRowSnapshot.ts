import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveWebhookConfigCreatorMemberId } from '@/scenes/manage/webhook/filter/buildWebhookConfigCreatorFilterOptions';
import { resolveRoleRecordNameFilterId } from './buildRoleRecordFilterOptions';

export function buildRoleRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    roleName: resolveRoleRecordNameFilterId(row.ruleName),
    roleCreator: resolveWebhookConfigCreatorMemberId(row.logOperatorName),
    roleCreatedTime: row.createdAt,
  };
}
