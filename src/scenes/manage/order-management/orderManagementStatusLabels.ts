import type { TagStatus } from '@eds/desktop-components';
import type { OrderManagementStatusKey } from './orderManagementTypes';

const STATUS_LABEL_KEY: Record<OrderManagementStatusKey, string> = {
  'Pending Payment': 'Pending Payment',
  'Order Completed': 'Order Completed',
  'Order Cancelled': 'Order Cancelled',
};

const STATUS_TAG: Record<OrderManagementStatusKey, TagStatus> = {
  'Pending Payment': 'ready',
  'Order Completed': 'success',
  'Order Cancelled': 'invalid',
};

export function resolveOrderManagementStatusLabelKey(statusKey: OrderManagementStatusKey): string {
  return STATUS_LABEL_KEY[statusKey];
}

export function resolveOrderManagementStatusTagStatus(statusKey: OrderManagementStatusKey): TagStatus {
  return STATUS_TAG[statusKey];
}
