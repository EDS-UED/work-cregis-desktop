import { isFeeRecordIncomeOperation } from './feeRecordOperationDirection';
import type { FeeRecordRow } from './feeRecordTypes';

function formatFeeRecordSignedFiatAmount(row: FeeRecordRow): string {
  const sign = isFeeRecordIncomeOperation(row.operationTypeKey) ? '+' : '-';
  return `${sign}$${row.amount}`;
}

export function buildFeeRecordTimeCustomize(row: FeeRecordRow): Record<string, unknown> {
  return {
    datetime: row.transactionTime,
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}

/** list-field-amount · 主行法币 + 副行账户（右对齐）。 */
export function buildFeeRecordAmountAccountCustomize(row: FeeRecordRow): Record<string, unknown> {
  return {
    amountType: 'conversion',
    primaryAmountKind: 'fiat',
    fiatValue: formatFeeRecordSignedFiatAmount(row),
    showCryptoIcon: false,
    showNetwork: false,
    secondaryValue: row.accountKey,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
