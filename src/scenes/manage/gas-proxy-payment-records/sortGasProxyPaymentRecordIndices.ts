import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildGasProxyPaymentRecordRow } from './gasProxyPaymentRecordData';

export type GasProxyPaymentRecordSortKey = 'time' | 'amount';

export function sortGasProxyPaymentRecordIndices(
  indices: readonly number[],
  key: GasProxyPaymentRecordSortKey,
  order: TasksDataListSortOrder,
): number[] {
  const direction = order === 'asc' ? 1 : -1;
  const sorted = [...indices];

  sorted.sort((indexA, indexB) => {
    const rowA = buildGasProxyPaymentRecordRow(indexA);
    const rowB = buildGasProxyPaymentRecordRow(indexB);

    if (key === 'time') {
      return rowA.transactionTime.localeCompare(rowB.transactionTime) * direction;
    }

    const amountA = parseAmountSortValue(rowA.deductedAmount);
    const amountB = parseAmountSortValue(rowB.deductedAmount);
    return (amountA - amountB) * direction;
  });

  return sorted;
}
