import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import {
  ORDER_MANAGEMENT_FILTER_FIELD_IDS,
  ORDER_MANAGEMENT_FILTER_FIELD_LABEL_KEYS,
  type OrderManagementFilterFieldId,
} from './orderManagementFilterFieldLabelKeys';
import {
  buildOrderManagementOperationTypeFilterOptions,
  buildOrderManagementStatusFilterOptions,
} from './buildOrderManagementFilterOptions';

function filterLabel(
  translate: (key: string) => string,
  fieldId: OrderManagementFilterFieldId,
): string {
  return translate(ORDER_MANAGEMENT_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

export const ORDER_MANAGEMENT_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;

export function buildOrderManagementFilterFields(
  translate: (key: string) => string,
): EgFilterField[] {
  const catalog: Record<OrderManagementFilterFieldId, EgFilterField> = {
    orderOperationType: {
      id: 'orderOperationType',
      label: filterLabel(translate, 'orderOperationType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildOrderManagementOperationTypeFilterOptions(translate),
    },
    orderStatus: {
      id: 'orderStatus',
      label: filterLabel(translate, 'orderStatus'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildOrderManagementStatusFilterOptions(translate),
    },
    orderCompletionTime: {
      id: 'orderCompletionTime',
      label: filterLabel(translate, 'orderCompletionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };

  return ORDER_MANAGEMENT_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
