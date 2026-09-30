import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveLogsRecordEventCategoryKey } from './resolveLogsRecordEventCategoryKey';
import { resolveLogsRecordOperatorMemberId } from './buildLogsRecordOperatorFilterOptions';
import {
  LOGS_RECORD_LOG_EVENT_NAMESPACE,
  LOGS_RECORD_LOG_TYPE_NAMESPACE,
} from './logsRecordFilterNamespaces';

export function buildLogsRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const logTypeKey = row.logTypeKey ?? 'Policy';
  const logActionKey = row.logActionKey ?? '';
  const eventCategoryKey = resolveLogsRecordEventCategoryKey(logActionKey);

  return {
    logType: resolveDataListFilterOptionId(LOGS_RECORD_LOG_TYPE_NAMESPACE, logTypeKey),
    logOperator: resolveLogsRecordOperatorMemberId(row.logOperatorName),
    logStrategyName: row.logStrategyName ?? row.ruleName ?? '',
    logStrategyNumber: row.logStrategyNumber ?? row.ruleNumber ?? '',
    logEvent: resolveDataListFilterOptionId(LOGS_RECORD_LOG_EVENT_NAMESPACE, eventCategoryKey),
    createdAt: row.createdAt,
  };
}
