import { formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';
import type { FeeRecordRow } from './feeRecordTypes';
import {
  normalizeFeeRecordAccountTransferInRow,
  pickFeeRecordGasAccountListSlot,
  resolveFeeRecordGasListMetaFromDisplayKey,
} from './feeRecordGasAccountListShape';
import { isFeeRecordIncomeOperation } from './feeRecordOperationDirection';

function feeRecordListAmountSign(row: FeeRecordRow): '+' | '-' {
  return isFeeRecordIncomeOperation(row.operationTypeKey) ? '+' : '-';
}

function formatFeeRecordFiatAmount(row: FeeRecordRow): string {
  const amount = formatGroupedTrimmedAmount(row.amount);
  return `${feeRecordListAmountSign(row)}$${amount}`;
}

function formatFeeRecordCryptoAmount(row: FeeRecordRow): string {
  return `${feeRecordListAmountSign(row)}${formatGroupedTrimmedAmount(row.amount)}`;
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
  const normalizedRow = normalizeFeeRecordAccountTransferInRow(row);
  const isAccountTransferIn = normalizedRow.operationTypeKey === 'Account Transfer In';
  const gasMeta = isAccountTransferIn
    ? (resolveFeeRecordGasListMetaFromDisplayKey(normalizedRow.accountDisplayKey)
      ?? pickFeeRecordGasAccountListSlot(0))
    : null;
  const secondaryValue = isAccountTransferIn
    ? (gasMeta?.accountDisplayKey ?? normalizedRow.accountDisplayKey ?? 'ETH Gas Account')
    : (normalizedRow.accountDisplayKey ?? normalizedRow.accountKey);
  const cryptoSymbol = normalizedRow.listAmountCryptoSymbol ?? gasMeta?.listAmountCryptoSymbol;
  const cryptoName = normalizedRow.listAmountCryptoName ?? gasMeta?.listAmountCryptoName;
  if (isAccountTransferIn || cryptoSymbol) {
    return {
      amountType: 'conversion',
      primaryAmountKind: 'crypto',
      cryptoValue: formatFeeRecordCryptoAmount(normalizedRow),
      cryptoSymbol,
      cryptoName,
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
    fiatValue: formatFeeRecordFiatAmount(normalizedRow),
    showCryptoIcon: false,
    showNetwork: false,
    secondaryValue,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
