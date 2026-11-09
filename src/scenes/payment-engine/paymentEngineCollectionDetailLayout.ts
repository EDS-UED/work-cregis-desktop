export const COLLECTION_DETAIL_HEADER_HEIGHT = 40;
export const COLLECTION_DETAIL_COLUMN_HEIGHT = 72;
export const COLLECTION_DETAIL_AMOUNT_FEE_COLUMN_MIN_WIDTH = '248px';
export const COLLECTION_DETAIL_ADDRESS_HASH_COLUMN_MIN_WIDTH = '160px';
export const COLLECTION_DETAIL_STATUS_COLUMN_MIN_WIDTH = '120px';
export const COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH = '176px';

/** 四列 min-width 之和，保证状态/时间列不被挤没（表宽不足时由 recordsTableClip 横滚）。 */
export const COLLECTION_DETAIL_TABLE_MIN_WIDTH_PX = 704;

/** EgDataList 判定溢出时每行按 1px 行距估算，与 `--eds-data-list-row-gap` 实际取值无关。 */
const DATA_LIST_ROW_GAP_ESTIMATE_PX = 1;
const COLLECTION_DETAIL_EMPTY_BODY_ROWS = 3;

/** 可见高度：表头 + 行（空表保留空态区域）。 */
export function computeCollectionDetailTableVisibleHeight(rowCount: number): number {
  const bodyRows = rowCount > 0 ? rowCount : COLLECTION_DETAIL_EMPTY_BODY_ROWS;
  return COLLECTION_DETAIL_HEADER_HEIGHT + bodyRows * COLLECTION_DETAIL_COLUMN_HEIGHT;
}

/** 交给 EgDataList 的测量高度：补足行距估算，使其不判定溢出、不开启表内纵滚。 */
export function computeCollectionDetailTableMeasureHeight(rowCount: number): number {
  return computeCollectionDetailTableVisibleHeight(rowCount) + rowCount * DATA_LIST_ROW_GAP_ESTIMATE_PX;
}
