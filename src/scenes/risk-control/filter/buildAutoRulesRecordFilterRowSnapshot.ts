import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveAutoRulesRecordDirectionFilterId,
  resolveAutoRulesRecordProviderFilterId,
  resolveAutoRulesRecordStatusFilterId,
} from './buildAutoRulesRecordFilterOptions';

export function buildAutoRulesRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  return {
    autoRuleScreeningDirection: resolveAutoRulesRecordDirectionFilterId(row.autoRuleDirection),
    autoRuleWaasProject: row.autoRuleWaasProject ?? '',
    autoRuleStatus: resolveAutoRulesRecordStatusFilterId(row.ruleEnabled),
    autoRuleServiceProvider: resolveAutoRulesRecordProviderFilterId(row.autoRuleServiceProvider),
  };
}
