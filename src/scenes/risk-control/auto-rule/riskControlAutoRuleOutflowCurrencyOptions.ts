import type { CryptoName, EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import {
  buildWaasSubAddressCurrencyFilterOptions,
  parseWaasSubAddressCurrencyPickerValue,
} from '@/scenes/waas-project/buildWaasSubAddressCurrencyFilterOptions';

export type RiskControlAutoRuleOutflowCurrencyEntry = {
  valueKey: string;
  symbol: string;
  cryptoName: CryptoName;
  networkLabel: string;
  minAmount: string;
};

export const AUTO_RULE_OUTFLOW_CURRENCY_OPTIONS: EgFilterFieldCurrencyOption[] =
  buildWaasSubAddressCurrencyFilterOptions();

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

  const { currencyKey, networkKey } = parseWaasSubAddressCurrencyPickerValue(trimmed);
  const option = AUTO_RULE_OUTFLOW_CURRENCY_OPTIONS.find((entry) => entry.id === currencyKey);
  if (!option) return null;

  const network = networkKey
    ? option.networks?.find((item) => item.key === networkKey)
    : undefined;

  return {
    valueKey: buildAutoRuleOutflowCurrencyValueKey(currencyKey, networkKey),
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
