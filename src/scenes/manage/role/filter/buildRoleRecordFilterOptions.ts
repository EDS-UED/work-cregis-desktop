import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import {
  compareDataListFilterCurrencyLabels,
  resolveDataListFilterOptionId,
} from '@/scenes/shared/dataListFilterOptionUtils';
import { buildManageRoleRecordRows } from '@/scenes/manage/role/roleRecordData';
import { MANAGE_ROLE_MENU_ITEM } from '@/scenes/manage/manageMenuData';
import { ROLE_RECORD_NAME_NAMESPACE } from './roleRecordFilterNamespaces';

export function resolveRoleRecordNameFilterId(roleName: string | undefined): string {
  const label = String(roleName ?? '').trim();
  if (!label) return '';
  return resolveDataListFilterOptionId(ROLE_RECORD_NAME_NAMESPACE, label);
}

export function buildRoleRecordNameFilterOptions(rowCount: number): EgFilterFieldDropdownOption[] {
  const rows = buildManageRoleRecordRows(MANAGE_ROLE_MENU_ITEM, rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];

  for (const row of rows) {
    const label = String(row.ruleName ?? '').trim();
    if (!label) continue;
    const id = resolveRoleRecordNameFilterId(label);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}
