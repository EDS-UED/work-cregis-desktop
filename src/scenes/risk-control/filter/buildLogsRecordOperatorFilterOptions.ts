import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';

function slugLogsOperatorMemberId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `member-${slug || 'unknown'}`;
}

export function resolveLogsRecordOperatorMemberId(operatorName: string | undefined): string {
  const displayName = String(operatorName ?? '').trim();
  if (!displayName) return '';
  return slugLogsOperatorMemberId(displayName);
}

/** Event 列 Avatar 与 Filter 成员选项共用 color-seed（= member id）。 */
export function resolveLogsRecordOperatorAvatarColorSeed(
  operatorName: string | undefined,
): string {
  return resolveLogsRecordOperatorMemberId(operatorName);
}

/** 与 Event 列操作人头像成员对齐。 */
export function buildLogsRecordOperatorFilterOptions(
  rowCount: number,
): EgFilterFieldMemberOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildRiskControlRecordRows('Logs', safeRowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldMemberOption[] = [];

  for (const row of rows) {
    const displayName = String(row.logOperatorName ?? '').trim();
    if (!displayName) continue;

    const id = slugLogsOperatorMemberId(displayName);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label: displayName, name: displayName });
  }

  return options.sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}
