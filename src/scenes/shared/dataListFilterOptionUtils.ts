import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';

export function slugDataListFilterOptionId(namespace: string, label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${namespace}-${slug || 'unknown'}`;
}

export function uniqueDataListFilterOptions(
  namespace: string,
  labels: readonly string[],
): EgFilterFieldDropdownOption[] {
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];
  for (const label of labels) {
    const trimmed = label.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    options.push({
      id: slugDataListFilterOptionId(namespace, trimmed),
      label: trimmed,
    });
  }
  return options;
}

export function resolveDataListFilterOptionId(
  namespace: string,
  label: string,
): string {
  return slugDataListFilterOptionId(namespace, label.trim());
}

/** 币种 symbol 排序：数字开头优先，其余 A–Z（与 DS 币种 picker 一致）。 */
export function compareDataListFilterCurrencyLabels(a: string, b: string): number {
  const labelA = a.trim().toUpperCase();
  const labelB = b.trim().toUpperCase();
  const aLeadingDigit = /^\d/.test(labelA);
  const bLeadingDigit = /^\d/.test(labelB);
  if (aLeadingDigit !== bLeadingDigit) {
    return aLeadingDigit ? -1 : 1;
  }
  return labelA.localeCompare(labelB, undefined, { sensitivity: 'base', numeric: true });
}
