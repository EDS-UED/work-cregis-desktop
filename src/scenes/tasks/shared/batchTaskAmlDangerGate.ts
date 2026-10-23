import { buildCurrencyAddressTags } from '../list-field/listFieldCurrencyTagCustomize';
import { buildTasksListFieldCurrencyCustomize } from '../list-field/tasksListFieldCurrencyDefaults';
import { resolveDetailTaskAmlInterceptFromReceivers } from './detailTaskAmlIntercept';

export function resolveBatchRowIndexesFromDataListRows(
  rows: Array<Record<string, unknown> & { _index?: number }>,
): number[] {
  return rows.map((row) => Number(row._index ?? row.id ?? 0));
}

/** 批处理选中行含 AML「危险」接收方时，须与详情 Pass/Sign 相同 EgConfirmPopover 二次确认。 */
export function batchSelectionIncludesAmlDangerRow(
  rowIndexes: readonly number[],
  menuItem: string,
  translate: (key: string) => string,
): boolean {
  return rowIndexes.some((rowIndex) => {
    const customize = buildTasksListFieldCurrencyCustomize(rowIndex, '', menuItem);
    const addressTags = buildCurrencyAddressTags('to', 1, customize);
    const intercept = resolveDetailTaskAmlInterceptFromReceivers(
      [{ addressTags }],
      translate,
    );
    return intercept.level === 'danger';
  });
}
