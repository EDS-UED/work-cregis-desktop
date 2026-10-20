import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { buildManageRoleRecordRows } from '@/scenes/manage/role/roleRecordData';
import { MANAGE_ROLE_MENU_ITEM } from '@/scenes/manage/manageMenuData';
import { resolveWebhookConfigCreatorMemberId } from '@/scenes/manage/webhook/filter/buildWebhookConfigCreatorFilterOptions';

export function buildRoleRecordCreatorFilterOptions(
  rowCount: number,
): EgFilterFieldMemberOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildManageRoleRecordRows(MANAGE_ROLE_MENU_ITEM, safeRowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldMemberOption[] = [];

  for (const row of rows) {
    const displayName = String(row.logOperatorName ?? '').trim();
    if (!displayName) continue;

    const id = resolveWebhookConfigCreatorMemberId(displayName);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label: displayName, name: displayName });
  }

  return options.sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}
