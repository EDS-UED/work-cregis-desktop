import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** 结算记录 EgFilter 字段 i18n labelKey 真源。 */
export const SETTLEMENT_RECORD_FILTER_FIELD_LABEL_KEYS = {
  settlementId: 'Settlement ID',
  settlementStatus: 'Settlement Status',
  settlementCurrency: 'Settlement Currency',
  settlementTime: 'Settlement Time',
  settlementAmount: 'Settlement Amount',
  settlementWalletAddress: 'Settlement Address',
} as const;

export type SettlementRecordFilterFieldId =
  keyof typeof SETTLEMENT_RECORD_FILTER_FIELD_LABEL_KEYS;

export function settlementRecordTimeColumnLabelKey(
  fieldId: Extract<SettlementRecordFilterFieldId, 'settlementTime'>,
): string {
  return dataListTimeColumnLabelKey(SETTLEMENT_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}
