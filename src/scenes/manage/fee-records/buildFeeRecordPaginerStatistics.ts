import type { PaginerStatisticsItem } from '@eds/desktop-components';
import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { buildFeeRecordRow } from './feeRecordData';
import { isFeeRecordIncomeOperation } from './feeRecordOperationDirection';

function formatSignedFiatTotal(total: number, sign: '+' | '-'): string {
  if (!Number.isFinite(total) || total === 0) {
    return `${sign}$0`;
  }
  const [whole = '0', fraction = '00'] = total.toFixed(2).split('.');
  return `${sign}$${formatGroupedDecimalAmount(whole)}.${fraction}`;
}

/** 费用记录 Paginer · 收入 / 支出汇总（全量数据，非当前页）。 */
export function buildFeeRecordPaginerStatistics(
  indices: readonly number[],
  translate: (catalogKey: string) => string,
): PaginerStatisticsItem[] {
  let incomeTotal = 0;
  let expenseTotal = 0;

  for (const index of indices) {
    const row = buildFeeRecordRow(index);
    const amount = parseAmountSortValue(row.amount);
    if (isFeeRecordIncomeOperation(row.operationTypeKey)) {
      incomeTotal += amount;
    } else {
      expenseTotal += amount;
    }
  }

  return [
    { text: translate('Monthly Income'), number: formatSignedFiatTotal(incomeTotal, '+') },
    { text: translate('Monthly Expense'), number: formatSignedFiatTotal(expenseTotal, '-') },
  ];
}
