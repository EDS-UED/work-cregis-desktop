import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildTransactionRecordRow } from './transactionRecordData';

export type TransactionRecordSortKey = 'time' | 'amount';

export function sortTransactionRecordIndices(
  indices: readonly number[],
  key: TransactionRecordSortKey,
  order: TasksDataListSortOrder,
): number[] {
  const direction = order === 'asc' ? 1 : -1;
  const sorted = [...indices];

  sorted.sort((indexA, indexB) => {
    const rowA = buildTransactionRecordRow(indexA);
    const rowB = buildTransactionRecordRow(indexB);

    if (key === 'time') {
      return rowA.transactionTime.localeCompare(rowB.transactionTime) * direction;
    }

    const amountA = parseAmountSortValue(rowA.amount);
    const amountB = parseAmountSortValue(rowB.amount);
    return (amountA - amountB) * direction;
  });

  return sorted;
}
