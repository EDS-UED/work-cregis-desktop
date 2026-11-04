import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { FEE_RECORDS_DEMO_TOTAL, buildFeeRecordRow } from '../feeRecordData';

function slugFeeRecordOperatorMemberId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `member-${slug || 'unknown'}`;
}

export function resolveFeeRecordOperatorMemberId(operatorName: string | undefined): string {
  const displayName = String(operatorName ?? '').trim();
  if (!displayName) return '';
  return slugFeeRecordOperatorMemberId(displayName);
}

export function buildFeeRecordOperatorFilterOptions(
  rowCount = FEE_RECORDS_DEMO_TOTAL,
): EgFilterFieldMemberOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldMemberOption[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    const displayName = String(buildFeeRecordRow(rowIndex).operatorName ?? '').trim();
    if (!displayName) continue;

    const id = slugFeeRecordOperatorMemberId(displayName);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label: displayName, name: displayName });
  }

  return options.sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}
