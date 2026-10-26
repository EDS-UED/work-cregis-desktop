import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveQueryRecordsCurrencyFilterId,
  resolveQueryRecordsObjectFilterId,
  resolveQueryRecordsProviderFilterId,
  resolveQueryRecordsResultFilterId,
  resolveQueryRecordsTypeFilterId,
} from './buildQueryRecordsRecordFilterOptions';

export function buildQueryRecordsRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    amlCurrency: resolveQueryRecordsCurrencyFilterId(row.amlCurrencySymbol),
    amlCollaborationNumber: row.amlCollaborationNumber?.trim() ?? '',
    amlWaasProject: row.amlWaasProject ?? '',
    amlQueryResult: row.amlQueryException
      ? resolveQueryRecordsResultFilterId('AML Exception')
      : resolveQueryRecordsResultFilterId(row.amlRiskLabelKey),
    amlServiceProvider: resolveQueryRecordsProviderFilterId(row.amlServiceProvider),
    amlQueryObject: resolveQueryRecordsObjectFilterId(row.amlQueryObjectKey),
    amlQueryType: resolveQueryRecordsTypeFilterId(row.amlTriggerModeKey),
    amlQueryTime: row.createdAt,
  };
}
