import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildOrderManagementRow } from './orderManagementData';

export type OrderManagementSortKey = 'amount' | 'orderPlacedTime';

export function sortOrderManagementIndices(
  indices: readonly number[],
  key: OrderManagementSortKey,
  order: TasksDataListSortOrder,
): number[] {
  const direction = order === 'asc' ? 1 : -1;
  const sorted = [...indices];

  sorted.sort((indexA, indexB) => {
    const rowA = buildOrderManagementRow(indexA);
    const rowB = buildOrderManagementRow(indexB);

    if (key === 'orderPlacedTime') {
      return rowA.orderPlacedTime.localeCompare(rowB.orderPlacedTime) * direction;
    }

    const amountA = parseAmountSortValue(rowA.amountDisplay.replace(/^\$/, ''));
    const amountB = parseAmountSortValue(rowB.amountDisplay.replace(/^\$/, ''));
    return (amountA - amountB) * direction;
  });

  return sorted;
}
