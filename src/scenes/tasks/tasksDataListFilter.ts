import {
  cloneConditionFilterRows,
  defaultConditionFilterRows,
  filledConditionFilterRows,
  type ConditionFilterFieldOption,
  type ConditionFilterRow,
} from '@/components/condition-filter/conditionFilter';
import {
  getPinnedAddressForRow,
  resolveSampleAddressForSymbol,
  sideAddressPoolIndex,
} from './list-field/listFieldCryptoSampleAddresses';

export type TasksDataListFilterField = 'hash' | 'sender' | 'receiver';
export type TasksDataListFilterCondition = ConditionFilterRow;

export const TASKS_DATA_LIST_FILTER_FIELDS: ConditionFilterFieldOption[] = [
  { key: 'hash', labelKey: 'Transaction hash' },
  { key: 'sender', labelKey: 'Sender' },
  { key: 'receiver', labelKey: 'Receiver' },
];

export const TASKS_DATA_LIST_FILTER_DEFAULT_KEYS = TASKS_DATA_LIST_FILTER_FIELDS.map(
  (field) => field.key,
);

export function defaultFilterConditions(): TasksDataListFilterCondition[] {
  return defaultConditionFilterRows(TASKS_DATA_LIST_FILTER_DEFAULT_KEYS);
}

export function cloneFilterConditions(
  conditions: TasksDataListFilterCondition[],
): TasksDataListFilterCondition[] {
  return cloneConditionFilterRows(conditions);
}

export function filledFilterConditions(
  conditions: TasksDataListFilterCondition[],
): TasksDataListFilterCondition[] {
  return filledConditionFilterRows(conditions);
}

function haystackForField(rowIndex: number, field: string): string {
  if (field === 'hash') {
    return String(rowIndex);
  }
  if (field === 'sender') {
    return (
      getPinnedAddressForRow(rowIndex) ??
      resolveSampleAddressForSymbol('ETH', sideAddressPoolIndex('from', rowIndex + 1))
    );
  }
  return resolveSampleAddressForSymbol('ETH', sideAddressPoolIndex('to', rowIndex + 1));
}

export function rowMatchesFilterConditions(
  row: Record<string, unknown>,
  conditions: TasksDataListFilterCondition[],
): boolean {
  const filled = filledFilterConditions(conditions);
  if (filled.length === 0) return true;
  const rowIndex = Number(row.id);
  if (!Number.isFinite(rowIndex)) return false;
  return filled.every((condition) =>
    haystackForField(rowIndex, condition.field)
      .toLowerCase()
      .includes(condition.value.trim().toLowerCase()),
  );
}
