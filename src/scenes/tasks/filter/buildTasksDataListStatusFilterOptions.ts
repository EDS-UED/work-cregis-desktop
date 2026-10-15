import type { EgFilterFieldStatusOption } from '@eds/desktop-components';
import {
  resolveDataListFilterOptionId,
} from '../../shared/dataListFilterOptionUtils';
import {
  buildStatusRowValues,
  type TasksListFieldStatusKind,
  type TasksListFieldStatusRow,
} from '../list-field/tasksListFieldStatusRowData';

const TASKS_STATUS_FILTER_NAMESPACE = 'tasks-status';

function toStatusFilterOption(row: TasksListFieldStatusRow): EgFilterFieldStatusOption {
  return {
    id: resolveDataListFilterOptionId(TASKS_STATUS_FILTER_NAMESPACE, row.label),
    label: row.label,
    status: row.status as EgFilterFieldStatusOption['status'],
  };
}

function uniqueStatusFilterOptions(
  rows: readonly TasksListFieldStatusRow[],
): EgFilterFieldStatusOption[] {
  const seen = new Set<string>();
  const options: EgFilterFieldStatusOption[] = [];
  for (const row of rows) {
    const label = row.label.trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push(toStatusFilterOption(row));
  }
  return options;
}

/** 菜单级 fallback：列表 mock 无行时仍展示该页可能出现的状态全集。 */
function fallbackStatusRowsForMenu(menuItem: string): TasksListFieldStatusRow[] {
  if (menuItem === 'Signed') {
    return [
      { status: 'success' as TasksListFieldStatusKind, label: 'Signature Passed' },
      { status: 'danger' as TasksListFieldStatusKind, label: 'Signature Reject' },
    ];
  }
  if (menuItem === 'All Records' || menuItem === 'Sent Request') {
    return [
      { status: 'warning', label: 'Pending Approval' },
      { status: 'danger', label: 'Approval Reject' },
      { status: 'warning', label: 'Waiting for signature' },
      { status: 'danger', label: 'Signature Reject' },
      { status: 'invalid', label: 'Withdrawn' },
      { status: 'success', label: 'Signature Passed' },
    ];
  }
  return [];
}

/** 从列表 mock 扫描 Status 列，生成与行数据对齐的筛选项。 */
export function buildTasksDataListStatusFilterOptions(
  rowCount: number,
  menuItem = 'Approval',
): EgFilterFieldStatusOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const rows: TasksListFieldStatusRow[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    rows.push(buildStatusRowValues(rowIndex, menuItem));
  }

  const options = uniqueStatusFilterOptions(rows);
  if (options.length > 0) return options;
  return uniqueStatusFilterOptions(fallbackStatusRowsForMenu(menuItem));
}

export function resolveTasksFilterStatusOptionId(
  rowIndex: number,
  menuItem?: string,
): string {
  const { label } = buildStatusRowValues(rowIndex, menuItem);
  return resolveDataListFilterOptionId(TASKS_STATUS_FILTER_NAMESPACE, label);
}
