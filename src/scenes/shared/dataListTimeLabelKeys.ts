/** DataList 列头时间字段后缀（历史 catalog；列头展示改由当前时区 offset 动态拼接）。 */
export const DATA_LIST_TIME_COLUMN_UTC_SUFFIX = ' UTC+08:00';

const DATA_LIST_TIME_UTC_SUFFIX_RE = /\sUTC[+-]\d{2}:\d{2}$/;

export function dataListTimeCatalogBaseFromLabelKey(labelKey: string): string {
  return labelKey.replace(DATA_LIST_TIME_UTC_SUFFIX_RE, '').trim();
}

/** 筛选短 label → 列表列头 labelKey（保留历史后缀，展示层会换为当前 offset）。 */
export function dataListTimeColumnLabelKey(filterLabelKey: string): string {
  const trimmed = filterLabelKey.trim();
  if (trimmed.endsWith('UTC+08:00')) return trimmed;
  return `${trimmed}${DATA_LIST_TIME_COLUMN_UTC_SUFFIX}`;
}

/** 列头 catalog 是否为时间/日期类（需追加当前时区 offset）。 */
export function isDataListTimeCatalogKey(labelKey: string): boolean {
  const trimmed = labelKey.trim();
  if (!trimmed) return false;
  const base = dataListTimeCatalogBaseFromLabelKey(trimmed);
  if (DATA_LIST_TIME_UTC_SUFFIX_RE.test(trimmed)) return true;
  if (base === 'Start') return true;
  if (/\bTimestamp\b/i.test(base)) return true;
  if (/\bTime\b/.test(base)) return true;
  if (/\bDate\b/.test(base)) return true;
  return false;
}

export function formatDataListTimeColumnTitle(
  translate: (catalogKey: string) => string,
  labelKey: string,
  offsetLabel: string,
): string {
  const key = labelKey.trim();
  if (!key) return '';
  if (!isDataListTimeCatalogKey(key)) {
    return translate(key);
  }
  return `${translate(dataListTimeCatalogBaseFromLabelKey(key))} ${offsetLabel}`;
}
