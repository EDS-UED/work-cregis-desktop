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

  if (columnKey === 'callbackAmountTime') {
    if (segment === 'secondary') {
      return compareCreatedTime(rowA, rowB);
    }
    return compareAmountValue(rowA.orderAmount, rowB.orderAmount);
  }

  if (columnKey === 'createdAt' || columnKey === 'callbackTime' || columnKey === 'amlQueryTime') {
    return compareCreatedTime(rowA, rowB);
  }

  if (columnKey === 'amlRiskScore') {
    if (segment === 'secondary') {
      return compareAmountValue(rowA.amlRiskScore ?? '0', rowB.amlRiskScore ?? '0');
    }
    return compareText(rowA.amlRiskLabelKey ?? '', rowB.amlRiskLabelKey ?? '');
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
    || columnKey === 'taskAmount'
    || columnKey === 'processingAmount'
  ) {
    return compareAmountValue(rowA.orderAmount, rowB.orderAmount);
  }

  if (columnKey === 'ruleNameId') {
    if (segment === 'secondary') {
      return compareText(rowA.ruleNumber ?? rowA.merchantOrderId, rowB.ruleNumber ?? rowB.merchantOrderId);
    }
    return compareText(rowA.ruleName ?? rowA.id, rowB.ruleName ?? rowB.id);
  }

  if (columnKey === 'taskDateRange') {
    if (segment === 'secondary') {
      return compareCreatedTime({
        ...rowA,
        createdAt: rowA.taskEndAt ?? rowA.createdAt,
      }, {
        ...rowB,
        createdAt: rowB.taskEndAt ?? rowB.createdAt,
      });
    }
    return compareCreatedTime({
      ...rowA,
      createdAt: rowA.taskStartAt ?? rowA.createdAt,
    }, {
      ...rowB,
      createdAt: rowB.taskStartAt ?? rowB.createdAt,
    });
  }

  if (columnKey === 'processingMeta') {
    if (segment === 'secondary') {
      return compareText(rowA.collectionId ?? rowA.id, rowB.collectionId ?? rowB.id);
    }
    return compareCreatedTime(rowA, rowB);
  }

  if (columnKey === 'collectionHistoryMeta') {
    if (segment === 'secondary') {
      return compareText(rowA.collectionId ?? rowA.id, rowB.collectionId ?? rowB.id);
    }
    return compareCreatedTime({
      ...rowA,
      createdAt: rowA.completionTime ?? rowA.createdAt,
    }, {
      ...rowB,
      createdAt: rowB.completionTime ?? rowB.createdAt,
    });
  }

  if (columnKey === 'subAddressMeta') {
    if (segment === 'secondary') {
      return compareAmountValue(
        rowA.subAddressBalance ?? rowA.orderAmount,
        rowB.subAddressBalance ?? rowB.orderAmount,
      );
    }
    return compareText(rowA.walletFromAddress ?? rowA.id, rowB.walletFromAddress ?? rowB.id);
  }

  if (columnKey === 'taskCurrencyId') {
    if (segment === 'secondary') {
      return compareText(rowA.taskTransactionCount ?? '0', rowB.taskTransactionCount ?? '0');
    }
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
