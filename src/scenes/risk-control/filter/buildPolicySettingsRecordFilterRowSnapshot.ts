import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolvePolicySettingsRecordStatusFilterId,
  resolvePolicySettingsRecordTypeFilterId,
} from './buildPolicySettingsRecordFilterOptions';

export function buildPolicySettingsRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    policyType: resolvePolicySettingsRecordTypeFilterId(row.policyTypeKey),
    policyStatus: resolvePolicySettingsRecordStatusFilterId(row.ruleEnabled),
    policyName: row.ruleName ?? '',
    policyNumber: row.ruleNumber ?? row.id ?? '',
  };
}
