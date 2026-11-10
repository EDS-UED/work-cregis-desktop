import type { PaginerStatisticsItem } from '@eds/desktop-components';
import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { FEE_RECORDS_DEMO_TOTAL, buildFeeRecordRow } from './feeRecordData';
import { isFeeRecordIncomeOperation } from './feeRecordOperationDirection';

function formatSignedFiatTotal(total: number, sign: '+' | '-'): string {
  if (!Number.isFinite(total) || total === 0) {
    return `${sign}$0`;
  }
  const [whole = '0', fraction = '00'] = total.toFixed(2).split('.');
  return `${sign}$${formatGroupedDecimalAmount(whole)}.${fraction}`;
}

/** 费用记录 Paginer · 本月 / 上月支出（mock：前半索引为本月、后半为上月）。 */
export function buildFeeRecordPaginerStatistics(
  indices: readonly number[],
  translate: (catalogKey: string) => string,
): PaginerStatisticsItem[] {
  let thisMonthExpenseTotal = 0;
  let lastMonthExpenseTotal = 0;

  for (const index of indices) {
    const row = buildFeeRecordRow(index);
    if (isFeeRecordIncomeOperation(row.operationTypeKey)) continue;
    const amount = parseAmountSortValue(row.amount);
    if (index < FEE_RECORDS_DEMO_TOTAL / 2) {
      thisMonthExpenseTotal += amount;
    } else {
      lastMonthExpenseTotal += amount;
    }
  }

  return [
    {
      text: translate('Monthly Expense'),
      number: formatSignedFiatTotal(thisMonthExpenseTotal, '-'),
    },
    {
      text: translate('Last Month Expense'),
      number: formatSignedFiatTotal(lastMonthExpenseTotal, '-'),
    },
  ];
}
