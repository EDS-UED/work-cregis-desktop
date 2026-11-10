import { formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';
import type { FeeRecordRow } from './feeRecordTypes';

function formatFeeRecordFiatAmount(row: FeeRecordRow): string {
  const amount = formatGroupedTrimmedAmount(row.amount);
  return `$${amount}`;
}

function formatFeeRecordCryptoAmount(row: FeeRecordRow): string {
  return formatGroupedTrimmedAmount(row.amount);
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
  const secondaryValue = row.accountDisplayKey ?? row.accountKey;
  if (row.listAmountCryptoSymbol) {
    return {
      amountType: 'conversion',
      primaryAmountKind: 'crypto',
      cryptoValue: formatFeeRecordCryptoAmount(row),
      cryptoSymbol: row.listAmountCryptoSymbol,
      cryptoName: row.listAmountCryptoName,
      fiatValue: '',
      showCryptoIcon: false,
      showNetwork: false,
      secondaryValue,
      alignEnd: true,
      tooltipTrigger: 'hover',
    };
  }
  return {
    amountType: 'conversion',
    primaryAmountKind: 'fiat',
    fiatValue: formatFeeRecordFiatAmount(row),
    showCryptoIcon: false,
    showNetwork: false,
    secondaryValue,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
