import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { buildBusinessTypeFilterActionLabel } from '../list-field/businessTypeDisplay';
import { buildPayoutWalletsColumnValues } from '../list-field/tasksListFieldBusinessTypeRowData';
import {
  resolveDataListFilterOptionId,
  uniqueDataListFilterOptions,
} from '../../shared/dataListFilterOptionUtils';
import { resolveSwapAppEntryForRow } from '../shared/swapAppEntries';
import {
  resolveTasksFilterApplicationOptionIdFromRow,
  resolveTasksFilterTriggerPolicyOptionIdFromRow,
} from './buildTasksDataListFilterOptionsFromRows';

export const TASKS_FILTER_TRIGGER_POLICY_OPTIONS: readonly EgFilterFieldDropdownOption[] = [
  {
    id: 'trigger-policy-high-value-guard-pol-0192',
    label: 'High Value Guard · #POL-0192',
  },
];

export function resolveTasksFilterApplicationOptionId(rowIndex: number): string {
  return resolveTasksFilterApplicationOptionIdFromRow(rowIndex);
}

export function resolveTasksFilterBusinessTypeOptionId(rowIndex: number): string {
  return resolveDataListFilterOptionId(
    'business-type',
    buildBusinessTypeFilterActionLabel(rowIndex),
  );
}

export function resolveTasksFilterOutboundWalletOptionId(rowIndex: number): string {
  return resolveDataListFilterOptionId(
    'outbound-wallet',
    buildPayoutWalletsColumnValues(rowIndex).value,
  );
}

export function resolveTasksFilterTriggerPolicyOptionId(
  rowIndex: number,
  strategy: string,
  menuItem?: string,
): string {
  const fromRow = resolveTasksFilterTriggerPolicyOptionIdFromRow(rowIndex, menuItem);
  if (fromRow) return fromRow;
  const matched = TASKS_FILTER_TRIGGER_POLICY_OPTIONS.find((option) => option.label === strategy);
  return matched?.id ?? resolveDataListFilterOptionId('trigger-policy', strategy);
}

export function resolveTasksFilterOptionLabel(
  options: readonly EgFilterFieldDropdownOption[],
  value: string,
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return options.find((option) => option.id === trimmed)?.label;
}

/** @deprecated 仅保留旧引用；新代码请用 buildTasksDataListFilterOptionsFromRows。 */
export function buildTasksFilterApplicationOptions(): EgFilterFieldDropdownOption[] {
  return Array.from({ length: 8 }, (_, rowIndex) => ({
    id: resolveTasksFilterApplicationOptionId(rowIndex),
    label: resolveSwapAppEntryForRow(rowIndex).label,
  })).filter((option, index, list) => list.findIndex((item) => item.id === option.id) === index);
}

/** @deprecated 仅保留旧引用；新代码请用 buildTasksDataListFilterOptionsFromRows。 */
export function buildTasksFilterBusinessTypeOptions(): EgFilterFieldDropdownOption[] {
  return uniqueDataListFilterOptions(
    'business-type',
    Array.from({ length: 32 }, (_, rowIndex) => buildBusinessTypeFilterActionLabel(rowIndex)),
  );
}

/** @deprecated 仅保留旧引用；新代码请用 buildTasksDataListFilterOptionsFromRows。 */
export function buildTasksFilterOutboundWalletOptions(): EgFilterFieldDropdownOption[] {
  return uniqueDataListFilterOptions(
    'outbound-wallet',
    Array.from({ length: 32 }, (_, rowIndex) => buildPayoutWalletsColumnValues(rowIndex).value),
  );
}
