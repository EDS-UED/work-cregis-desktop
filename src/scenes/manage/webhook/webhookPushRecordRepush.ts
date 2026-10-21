import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/** 推送失败且尚未手动重推的行可执行「重新推送」。 */
export function isWebhookPushRecordRepushEligible(row: PaymentEngineRecordRow): boolean {
  return row.webhookPushStatusKey === 'failed' && !row.webhookManuallyRetried;
}

export function filterWebhookPushRecordsRepushEligible(
  rows: readonly PaymentEngineRecordRow[],
): PaymentEngineRecordRow[] {
  return rows.filter(isWebhookPushRecordRepushEligible);
}
