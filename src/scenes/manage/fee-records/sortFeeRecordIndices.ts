import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildFeeRecordRow } from './feeRecordData';

export type FeeRecordSortKey = 'time' | 'amount';

export function sortFeeRecordIndices(
  indices: readonly number[],
  key: FeeRecordSortKey,
  order: TasksDataListSortOrder,
): number[] {
  const direction = order === 'asc' ? 1 : -1;
  const sorted = [...indices];

  sorted.sort((indexA, indexB) => {
    const rowA = buildFeeRecordRow(indexA);
    const rowB = buildFeeRecordRow(indexB);

    if (key === 'time') {
      return rowA.transactionTime.localeCompare(rowB.transactionTime) * direction;
    }

    const amountA = parseAmountSortValue(rowA.amount);
    const amountB = parseAmountSortValue(rowB.amount);
    return (amountA - amountB) * direction;
  });

  return sorted;
}
