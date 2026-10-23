import {
  BATCH_DATA_LIST_COLUMN_HEIGHT,
  BATCH_DATA_LIST_ROW_GAP_PX,
} from '@/scenes/tasks/signing/batch/batchDataListLayout';
import { DATA_LIST_FIGMA_HEADER_HEIGHT } from '@/scenes/tasks/tasksDataListPageData';

/** EgDataList 标准表头（Showcase DataListPage）。 */
export const AML_EMBEDDED_DATA_LIST_HEADER_HEIGHT = DATA_LIST_FIGMA_HEADER_HEIGHT;

/** EgDataList Xl 行高（与 PaymentEngine / 批签详情一致）。 */
export const AML_EMBEDDED_DATA_LIST_COLUMN_HEIGHT = BATCH_DATA_LIST_COLUMN_HEIGHT;

/** 空表正文区高度（表头另计）。 */
export const AML_EMBEDDED_DATA_LIST_EMPTY_BODY_HEIGHT = 240;

export function computeAmlEmbeddedDataListHeight(rowCount: number): number {
  if (rowCount <= 0) {
    return AML_EMBEDDED_DATA_LIST_HEADER_HEIGHT + AML_EMBEDDED_DATA_LIST_EMPTY_BODY_HEIGHT;
  }
  return (
    AML_EMBEDDED_DATA_LIST_HEADER_HEIGHT
    + rowCount * (AML_EMBEDDED_DATA_LIST_COLUMN_HEIGHT + BATCH_DATA_LIST_ROW_GAP_PX)
    + BATCH_DATA_LIST_ROW_GAP_PX
  );
}
