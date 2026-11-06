import type {
  EgFilterFieldDropdownOption,
  EgFilterFieldMemberOption,
} from '@eds/desktop-components';
import {
  compareDataListFilterCurrencyLabels,
  resolveDataListFilterOptionId,
} from '@/scenes/shared/dataListFilterOptionUtils';
import { buildManageMemberRecordRows } from '@/scenes/manage/member/memberRecordData';
import { MANAGE_MEMBER_MENU_ITEM } from '@/scenes/manage/manageMenuData';
import {
  resolveManageMemberStatusKey,
  resolveManageMemberStatusLabelKey,
} from '@/scenes/manage/member/manageMemberStatusLabels';
import {
  MEMBER_RECORD_EMAIL_NAMESPACE,
  MEMBER_RECORD_NICKNAME_NAMESPACE,
  MEMBER_RECORD_ROLE_NAMESPACE,
  MEMBER_RECORD_STATUS_NAMESPACE,
} from './memberRecordFilterNamespaces';

export function resolveMemberRecordNicknameFilterId(nickname: string | undefined): string {
  const label = String(nickname ?? '').trim();
  if (!label) return '';
  return resolveDataListFilterOptionId(MEMBER_RECORD_NICKNAME_NAMESPACE, label);
}

export function resolveMemberRecordEmailFilterId(email: string | undefined): string {
  const label = String(email ?? '').trim();
  if (!label) return '';
  return resolveDataListFilterOptionId(MEMBER_RECORD_EMAIL_NAMESPACE, label);
}

export function resolveMemberRecordRoleFilterId(roleName: string | undefined): string {
  const label = String(roleName ?? '').trim();
  if (!label) return '';
  return resolveDataListFilterOptionId(MEMBER_RECORD_ROLE_NAMESPACE, label);
}

export function resolveMemberRecordStatusFilterId(
  statusKey: ReturnType<typeof resolveManageMemberStatusKey>,
): string {
  return resolveDataListFilterOptionId(
    MEMBER_RECORD_STATUS_NAMESPACE,
    resolveManageMemberStatusLabelKey(statusKey),
  );
}

export function buildMemberRecordNicknameFilterOptions(
  rowCount: number,
): EgFilterFieldDropdownOption[] {
  return buildMemberRecordNicknameMemberFilterOptions(rowCount).map(({ id, label }) => ({
    id,
    label,
  }));
}

/** EgMemberTooltip 成员筛选项（带头像；id 与 nickname dropdown 一致）。 */
export function buildMemberRecordNicknameMemberFilterOptions(
  rowCount: number,
): EgFilterFieldMemberOption[] {
  const rows = buildManageMemberRecordRows(MANAGE_MEMBER_MENU_ITEM, rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldMemberOption[] = [];

  for (const row of rows) {
    const label = String(row.logOperatorName ?? '').trim();
    if (!label) continue;
    const id = resolveMemberRecordNicknameFilterId(label);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label, name: label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}

export function buildMemberRecordEmailFilterOptions(rowCount: number): EgFilterFieldDropdownOption[] {
  const rows = buildManageMemberRecordRows(MANAGE_MEMBER_MENU_ITEM, rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];

  for (const row of rows) {
    const label = String(row.webhookCreatorEmail ?? '').trim();
    if (!label) continue;
    const id = resolveMemberRecordEmailFilterId(label);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}

export function buildMemberRecordRoleFilterOptions(rowCount: number): EgFilterFieldDropdownOption[] {
  const rows = buildManageMemberRecordRows(MANAGE_MEMBER_MENU_ITEM, rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];

  for (const row of rows) {
    const label = String(row.ruleName ?? '').trim();
    if (!label) continue;
    const id = resolveMemberRecordRoleFilterId(label);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}

export function buildMemberRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  const keys = ['pending-join', 'disabled', 'normal'] as const;
  return keys.map((statusKey) => {
    const labelKey = resolveManageMemberStatusLabelKey(statusKey);
    return {
      id: resolveMemberRecordStatusFilterId(statusKey),
      label: translate(labelKey),
    };
  });
}
