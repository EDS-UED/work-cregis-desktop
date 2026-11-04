import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { EMPTY_DISPLAY } from '@/utils/formatEmptyDisplay';
import type { OrderManagementRow } from './orderManagementTypes';
import {
  resolveOrderManagementStatusLabelKey,
  resolveOrderManagementStatusTagStatus,
} from './orderManagementStatusLabels';

export function resolveOrderManagementDetailEyebrow(
  row: OrderManagementRow,
  translate: (catalogKey: string) => string,
): string {
  return translate(row.operationTypeKey);
}

export function resolveOrderManagementDetailHeadline(row: OrderManagementRow): string {
  return row.amountDisplay;
}

export function resolveOrderManagementDetailHeadlineStatus(
  row: OrderManagementRow,
  translate: (catalogKey: string) => string,
) {
  return {
    label: translate(resolveOrderManagementStatusLabelKey(row.statusKey)),
    status: resolveOrderManagementStatusTagStatus(row.statusKey),
  };
}

function formatPlanDetailValue(row: OrderManagementRow): string {
  return `${row.planFrom} -> ${row.planTo}`;
}

export function buildOrderManagementDetailSections(
  row: OrderManagementRow,
  translate: (catalogKey: string) => string,
): DetailSectionData[] {
  const planItem: DetailItemData = {
    ...createDetailApplyItemRow('text', {
      key: 'order-plan',
      title: translate('Fee Record Plan'),
      value: formatPlanDetailValue(row),
    }),
    titleIcon: 'eds-module-three',
  };

  const orderNumberItem: DetailItemData = {
    ...createDetailApplyItemRow('brand-number', {
      key: 'order-number',
      title: translate('Fee Record Order Number'),
      value: row.orderNumber,
    }),
    titleIcon: 'eds-brand-numbers',
  };

  const items: DetailItemData[] = [
    planItem,
    orderNumberItem,
    {
      ...createDetailApplyItemRow('text', {
        key: 'order-placed-time',
        title: translate('Order Placed Time'),
        value: row.orderPlacedTime,
      }),
      titleIcon: 'eds-calendar-start',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'order-completion-time',
        title: translate('Completion Time'),
        value: row.completionTime?.trim() || EMPTY_DISPLAY,
      }),
      titleIcon: 'eds-calendar-end',
    },
  ];

  return [{ key: 'order-management-detail', items }];
}
