import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveAutomationRecordStatusFilterId,
  resolveAutomationRecordTypeFilterId,
} from './buildAutomationRecordFilterOptions';

export function buildAutomationRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    automationType: resolveAutomationRecordTypeFilterId(row.automationTypeKey),
    automationStatus: resolveAutomationRecordStatusFilterId(row.ruleEnabled),
    automationName: row.ruleName ?? '',
    automationNumber: row.ruleNumber ?? row.id ?? '',
  };
}
