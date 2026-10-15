import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '../../shared/dataListFilterOptionUtils';
import { buildTasksListFieldGeneralStructureCustomize } from '../list-field/tasksListFieldGeneralStructureDefaults';

export type TasksDataListInitiatorFilterOptions = {
  memberOptions: EgFilterFieldMemberOption[];
  waasProjectOptions: EgFilterFieldMemberOption[];
};

function slugInitiatorFilterId(prefix: 'member' | 'waas-project', label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${prefix}-${slug || 'unknown'}`;
}

function resolveInitiatorListPrimaryLabel(
  rawValue: string,
  customize: Record<string, unknown>,
): string {
  const trimmed = rawValue.trim();
  if (!trimmed) return trimmed;

  const iconKind = String(customize.initiatorIconKind ?? 'avatar');
  if (iconKind === 'avatar' || iconKind === 'app') {
    const parenIndex = trimmed.indexOf(' (');
    if (parenIndex > 0 && trimmed.includes('@')) {
      return trimmed.slice(0, parenIndex).trim();
    }
  }

  return trimmed;
}

function sortMemberOptions(
  options: EgFilterFieldMemberOption[],
): EgFilterFieldMemberOption[] {
  return [...options].sort((a, b) =>
    compareDataListFilterCurrencyLabels(a.label, b.label),
  );
}

/** 与列表 general-structure 列一致：成员带头像，WaaS 项目无头像。 */
export function buildTasksDataListInitiatorFilterOptions(
  rowCount: number,
  menuItem?: string,
): TasksDataListInitiatorFilterOptions {
  const safeRowCount = Math.max(0, rowCount);
  const seenMemberIds = new Set<string>();
  const seenWaasIds = new Set<string>();
  const memberOptions: EgFilterFieldMemberOption[] = [];
  const waasProjectOptions: EgFilterFieldMemberOption[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    const customize = buildTasksListFieldGeneralStructureCustomize('', rowIndex, menuItem);
    const rawValue = String(customize.value ?? '').trim();
    if (!rawValue) continue;

    const displayName = resolveInitiatorListPrimaryLabel(rawValue, customize);
    if (!displayName) continue;

    const iconKind = String(customize.initiatorIconKind ?? 'avatar');
    if (iconKind === 'none') {
      const id = slugInitiatorFilterId('waas-project', displayName);
      if (seenWaasIds.has(id)) continue;
      seenWaasIds.add(id);
      waasProjectOptions.push({ id, label: displayName, name: displayName });
      continue;
    }

    const id = slugInitiatorFilterId('member', displayName);
    if (seenMemberIds.has(id)) continue;
    seenMemberIds.add(id);
    memberOptions.push({ id, label: displayName, name: displayName });
  }

  return {
    memberOptions: sortMemberOptions(memberOptions),
    waasProjectOptions: sortMemberOptions(waasProjectOptions),
  };
}

export function resolveTasksInitiatorFilterRawValue(
  rowIndex: number,
  menuItem?: string,
): string {
  const customize = buildTasksListFieldGeneralStructureCustomize('', rowIndex, menuItem);
  return String(customize.value ?? '').trim();
}

export function resolveTasksFilterInitiatorMemberId(
  rowIndex: number,
  menuItem?: string,
): string {
  const customize = buildTasksListFieldGeneralStructureCustomize('', rowIndex, menuItem);
  const rawValue = String(customize.value ?? '').trim();
  if (!rawValue) return '';

  const displayName = resolveInitiatorListPrimaryLabel(rawValue, customize);
  if (!displayName) return '';

  const iconKind = String(customize.initiatorIconKind ?? 'avatar');
  if (iconKind === 'none') {
    return slugInitiatorFilterId('waas-project', displayName);
  }
  return slugInitiatorFilterId('member', displayName);
}
