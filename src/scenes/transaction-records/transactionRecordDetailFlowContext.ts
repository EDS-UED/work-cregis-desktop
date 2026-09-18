import { shallowRef } from 'vue';
import type { useTransactionRecordDetailFlow } from './useTransactionRecordDetailFlow';

export type TransactionRecordDetailFlowInstance = ReturnType<
  typeof useTransactionRecordDetailFlow
>;

export const transactionRecordDetailFlowRegistry =
  shallowRef<TransactionRecordDetailFlowInstance | null>(null);

export function registerTransactionRecordDetailFlow(
  flow: TransactionRecordDetailFlowInstance | null,
) {
  transactionRecordDetailFlowRegistry.value = flow;
}
