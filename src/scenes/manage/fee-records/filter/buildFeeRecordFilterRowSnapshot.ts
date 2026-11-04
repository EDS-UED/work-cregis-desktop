import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import type { FeeRecordRow } from '../feeRecordTypes';
import { resolveFeeRecordOperatorMemberId } from './buildFeeRecordOperatorFilterOptions';

export function buildFeeRecordFilterRowSnapshot(row: FeeRecordRow): EgFilterRowSnapshot {
  return {
    feeOperationType: resolveDataListFilterOptionId('fee-op-type', row.operationTypeKey),
    feeTxHash: row.txHash,
    feeOperator: resolveFeeRecordOperatorMemberId(row.operatorName),
    feeTransactionTime: row.transactionTime,
    feeAccount: resolveDataListFilterOptionId('fee-account', row.accountKey),
  };
}
