import { formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type {
  GasProxyPaymentAccountKey,
  GasProxyPaymentRecordRow,
} from './gasProxyPaymentRecordTypes';

const GAS_ACCOUNT_DEDUCT_SYMBOL: Record<
  Exclude<GasProxyPaymentAccountKey, 'Team Account'>,
  string
> = {
  'ETH Gas Account': 'ETH',
  'BNB Gas Account': 'BNB',
  'POL Gas Account': 'POL',
  'SOL Gas Account': 'SOL',
};

/** 交易币种 · EgCryptoCombo unaddress（与链上交易一致，非扣费账户币种）。 */
export function buildGasProxyTransactionCurrencyCustomize(
  row: GasProxyPaymentRecordRow,
): Record<string, unknown> {
  return {
    symbol: row.symbol,
    cryptoName: row.cryptoName,
    showNetwork: row.showNetwork,
    networkLabel: row.networkLabel,
    comboMode: 'currency-only',
    entryBadgeMode: 'none',
    fromSideVisible: false,
    toSideVisible: false,
    tooltipTrigger: 'hover',
  };
}

export function buildGasProxyTimeCustomize(row: GasProxyPaymentRecordRow): Record<string, unknown> {
  return {
    datetime: row.transactionTime,
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}

function gasAccountDeductedCryptoAmount(row: GasProxyPaymentRecordRow): {
  cryptoValue: string;
  cryptoSymbol: string;
  cryptoName: string;
} {
  const gasSymbol =
    GAS_ACCOUNT_DEDUCT_SYMBOL[row.accountKey as Exclude<GasProxyPaymentAccountKey, 'Team Account'>];
  const cryptoName = resolveCryptoNameFromSymbol(gasSymbol) ?? row.cryptoName;
  return {
    cryptoValue: formatGroupedTrimmedAmount(row.deductedAmountGasNative),
    cryptoSymbol: gasSymbol,
    cryptoName,
  };
}

/** list-field-amount · 团队账户主行 $；Gas 账户主行原生币 + 账户副行（无 +/-）。 */
export function buildGasProxyDeductedAmountAccountCustomize(
  row: GasProxyPaymentRecordRow,
): Record<string, unknown> {
  const secondaryValue = row.accountKey;
  if (row.accountKey === 'Team Account') {
    return {
      amountType: 'conversion',
      primaryAmountKind: 'fiat',
      fiatValue: row.deductedAmountFiatDisplay,
      showCryptoIcon: false,
      showNetwork: false,
      secondaryValue,
      alignEnd: true,
      tooltipTrigger: 'hover',
    };
  }

  const gasAmount = gasAccountDeductedCryptoAmount(row);
  return {
    amountType: 'conversion',
    primaryAmountKind: 'crypto',
    cryptoValue: gasAmount.cryptoValue,
    cryptoSymbol: gasAmount.cryptoSymbol,
    cryptoName: gasAmount.cryptoName,
    fiatValue: '',
    showCryptoIcon: false,
    showNetwork: false,
    secondaryValue,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
