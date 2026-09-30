/** DataList 列头时间字段后缀（EgFilter 同名基词不带此后缀）。 */
export const DATA_LIST_TIME_COLUMN_UTC_SUFFIX = ' UTC+08:00';

/** 筛选短 label → 列表列头 labelKey（追加 UTC+08:00）。 */
export function dataListTimeColumnLabelKey(filterLabelKey: string): string {
  const trimmed = filterLabelKey.trim();
  if (trimmed.endsWith('UTC+08:00')) return trimmed;
  return `${trimmed}${DATA_LIST_TIME_COLUMN_UTC_SUFFIX}`;
}
