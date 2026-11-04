import type { GasProxyPaymentRecordRow } from './gasProxyPaymentRecordTypes';

export function buildGasProxyTimeCustomize(row: GasProxyPaymentRecordRow): Record<string, unknown> {
  return {
    datetime: row.transactionTime,
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}

/** list-field-amount · 图标 + 加密货币主行 + 链 Tag + 账户副行（右对齐）。 */
export function buildGasProxyDeductedAmountAccountCustomize(
  row: GasProxyPaymentRecordRow,
): Record<string, unknown> {
  return {
    amountType: 'conversion',
    cryptoValue: row.deductedAmount,
    cryptoSymbol: row.symbol,
    cryptoName: row.cryptoName,
    showCryptoIcon: true,
    showCryptoSymbolInPrimary: true,
    showNetwork: row.showNetwork,
    networkLabel: row.networkLabel,
    secondaryValue: row.accountKey,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
