import {
  parseAmountSortValue,
  parseCreatedTimeSortValue,
  type TasksDataListSortOrder,
} from '@/scenes/tasks/tasksDataListSort';
import type {
  PaymentEngineRecordColumnKey,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

export type PaymentEngineRecordSortSegment = 'primary' | 'secondary';

export type PaymentEngineRecordSortTarget = {
  columnKey: PaymentEngineRecordColumnKey;
  segment: PaymentEngineRecordSortSegment;
  order: TasksDataListSortOrder;
};

function compareText(valueA: string, valueB: string): number {
  return valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
}

function compareCreatedTime(rowA: PaymentEngineRecordRow, rowB: PaymentEngineRecordRow): number {
  return (
    parseCreatedTimeSortValue(rowA.createdAt) - parseCreatedTimeSortValue(rowB.createdAt)
  );
}

function compareAmountValue(amountA: string, amountB: string): number {
  return parseAmountSortValue(amountA) - parseAmountSortValue(amountB);
}

function compareRows(
  rowA: PaymentEngineRecordRow,
  rowB: PaymentEngineRecordRow,
  target: PaymentEngineRecordSortTarget,
): number {
  const { columnKey, segment } = target;

  if (columnKey === 'orderIds' || columnKey === 'settlementNumber') {
    if (segment === 'secondary') {
      return compareText(rowA.merchantOrderId, rowB.merchantOrderId);
    }
    return compareText(rowA.id, rowB.id);
  }

  if (columnKey === 'createdAt' || columnKey === 'callbackTime') {
    return compareCreatedTime(rowA, rowB);
  }

  if (columnKey === 'refundMeta') {
    if (segment === 'secondary') {
      return compareText(rowA.merchantOrderId, rowB.merchantOrderId);
    }
    return compareCreatedTime(rowA, rowB);
  }

  if (columnKey === 'orderAmounts') {
    if (segment === 'secondary') {
      return compareAmountValue(rowA.orderAmount, rowB.orderAmount);
    }
    return compareAmountValue(rowA.receivedAmount || '0', rowB.receivedAmount || '0');
  }

  if (
    columnKey === 'bulkAmount'
    || columnKey === 'refundAmount'
    || columnKey === 'callbackAmount'
  ) {
    return compareAmountValue(rowA.orderAmount, rowB.orderAmount);
  }

  return 0;
}

export function sortPaymentEngineRecordRows(
  rows: readonly PaymentEngineRecordRow[],
  target: PaymentEngineRecordSortTarget,
): PaymentEngineRecordRow[] {
  const direction = target.order === 'asc' ? 1 : -1;
  return [...rows].sort((rowA, rowB) => compareRows(rowA, rowB, target) * direction);
}
