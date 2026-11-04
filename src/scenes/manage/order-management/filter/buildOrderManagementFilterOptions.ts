import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  ORDER_MANAGEMENT_OPERATION_TYPE_KEYS,
  ORDER_MANAGEMENT_STATUS_KEYS,
} from '../orderManagementTypes';

const ORDER_OPERATION_NAMESPACE = 'manage-order-operation';
const ORDER_STATUS_NAMESPACE = 'manage-order-status';

export function buildOrderManagementOperationTypeFilterOptions(translate: (key: string) => string) {
  return ORDER_MANAGEMENT_OPERATION_TYPE_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(ORDER_OPERATION_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildOrderManagementStatusFilterOptions(translate: (key: string) => string) {
  return ORDER_MANAGEMENT_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(ORDER_STATUS_NAMESPACE, key),
    label: translate(resolveOrderManagementStatusFilterLabelKey(key)),
  }));
}

function resolveOrderManagementStatusFilterLabelKey(key: string): string {
  if (key === 'Order Completed') return 'Order Completed';
  if (key === 'Order Cancelled') return 'Order Cancelled';
  return key;
}

export function resolveOrderManagementOperationTypeFilterOptionId(operationTypeKey: string): string {
  return resolveDataListFilterOptionId(ORDER_OPERATION_NAMESPACE, operationTypeKey);
}

export function resolveOrderManagementStatusFilterOptionId(statusKey: string): string {
  return resolveDataListFilterOptionId(ORDER_STATUS_NAMESPACE, statusKey);
}
