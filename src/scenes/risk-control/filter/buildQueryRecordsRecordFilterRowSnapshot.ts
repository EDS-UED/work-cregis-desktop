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
    amlWaasProject: row.amlWaasProject ?? '',
    amlQueryResult: resolveQueryRecordsResultFilterId(row.amlRiskLabelKey),
    amlServiceProvider: resolveQueryRecordsProviderFilterId(row.amlServiceProvider),
    amlQueryObject: resolveQueryRecordsObjectFilterId(row.amlQueryObjectKey),
    amlQueryType: resolveQueryRecordsTypeFilterId(row.amlTriggerModeKey),
    amlQueryTime: row.createdAt,
  };
}
