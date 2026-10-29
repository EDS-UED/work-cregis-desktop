import type { CryptoName } from '@eds/desktop-components';
import {
  AUTO_RULE_CURRENCY_PICKER_CATALOG,
  parseFilterCurrencyValue,
} from './riskControlAutoRuleCurrencyPickerCatalog';

export type RiskControlAutoRuleOutflowCurrencyEntry = {
  valueKey: string;
  symbol: string;
  cryptoName: CryptoName;
  networkLabel: string;
  minAmount: string;
};

export function buildAutoRuleOutflowCurrencyValueKey(
  optionId: string,
  networkKey = '',
): string {
  const trimmedNetwork = networkKey.trim();
  if (!trimmedNetwork) return optionId;
  return `${optionId}:${trimmedNetwork}`;
}

export function resolveAutoRuleOutflowCurrencyEntryFromValueKey(
  valueKey: string,
): Omit<RiskControlAutoRuleOutflowCurrencyEntry, 'minAmount'> | null {
  const trimmed = valueKey.trim();
  if (!trimmed) return null;

  const { currencyId, networkKey } = parseFilterCurrencyValue(trimmed);
  const option = AUTO_RULE_CURRENCY_PICKER_CATALOG.find((entry) => entry.id === currencyId);
  if (!option) return null;

  const network = networkKey
    ? option.networks?.find((item) => item.key === networkKey)
    : undefined;

  return {
    valueKey: buildAutoRuleOutflowCurrencyValueKey(currencyId, networkKey),
    symbol: option.label,
    cryptoName: option.cryptoName,
    networkLabel: network?.label ?? option.chainTagLabel ?? '',
  };
}

export function formatAutoRuleOutflowCurrencyMinAmount(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '0';
  return trimmed;
}
