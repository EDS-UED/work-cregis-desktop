import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';

/** 归集详情记录 Tab 右侧筛选：占位字段，与列表页视觉对齐。 */
export function buildPaymentEngineCollectionDetailRecordFilterFields(
  translate: (key: string) => string,
): { fields: EgFilterField[]; operators: EgFilterOperator[] } {
  return {
    fields: [
      {
        id: 'collection-detail-record-placeholder',
        label: translate('Transaction hash'),
        kind: 'input',
        placeholder: FILTER_INPUT_PLACEHOLDER,
      },
    ],
    operators: DEFAULT_FILTER_OPERATORS,
  };
}
