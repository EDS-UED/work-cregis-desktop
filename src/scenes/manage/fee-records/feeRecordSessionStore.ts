import { ref } from 'vue';
import type { FeeRecordRow } from './feeRecordTypes';

/** 业务 mock 写入的费用记录（插入列表首页顶部）。 */
export const feeRecordSessionRows = ref<FeeRecordRow[]>([]);

export function prependFeeRecordSessionRows(rows: readonly FeeRecordRow[]) {
  feeRecordSessionRows.value = [...rows, ...feeRecordSessionRows.value];
}

export function patchFeeRecordSessionRow(id: string, patch: Partial<FeeRecordRow>) {
  feeRecordSessionRows.value = feeRecordSessionRows.value.map((row) =>
    row.id === id ? { ...row, ...patch } : row,
  );
}
