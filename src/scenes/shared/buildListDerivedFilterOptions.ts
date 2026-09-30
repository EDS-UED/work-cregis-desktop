/**
 * 各模块 EgFilter 下拉 / 币种选项应从 DataList mock 同行索引扫描生成，
 * 禁止直接使用 EDS 内置演示 catalog（FILTER_CURRENCY_PRESETS 全量、FILTER_MEMBER_PRESETS 等）。
 *
 * 选项行数须用 `resolveDataListFilterSourceRowCount`（菜单默认 mock 量），
 * 勿用筛选后可见行数，避免「筛选后选项变少」。
 *
 * 参考实现：
 * - `dataListFilterOptionUtils.ts` — option id / 去重
 * - `tasks/filter/buildTasksDataListFilterOptionsFromRows.ts` — Tasks 扫描
 * - `tasks/filter/buildTasksDataListFilterRowSnapshot.ts` — 行快照与 option id 对齐
 * - `applyEgFilterConditions.ts` — 条件匹配
 */
export {
  compareDataListFilterCurrencyLabels,
  resolveDataListFilterOptionId,
  slugDataListFilterOptionId,
  uniqueDataListFilterOptions,
} from './dataListFilterOptionUtils';

/** EgFilter 选项扫描行数：始终对齐菜单 mock 全量，不受 EgFilter 结果或列表空态影响。 */
export function resolveDataListFilterSourceRowCount(
  _empty: boolean,
  defaultRowCount: number,
): number {
  return Math.max(0, defaultRowCount);
}
