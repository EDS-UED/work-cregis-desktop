import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import {
  WAAS_SUB_ADDRESS_CURRENCY_OPTIONS,
  type WaasSubAddressCurrencyOption,
} from './waasSubAddressCurrencyPickerData';

function toFilterCurrencyOption(
  option: WaasSubAddressCurrencyOption,
): EgFilterFieldCurrencyOption {
  if (option.multiChain && option.networks?.length) {
    return {
      id: option.key,
      label: option.symbol,
      cryptoName: option.cryptoName,
      multiChain: true,
      modeTag: '多链',
      messageText: String(option.chainCount ?? option.networks.length),
      networks: option.networks.map((network) => ({
        key: network.key,
        label: network.label,
        cryptoName: network.cryptoName,
      })),
    };
  }

  return {
    id: option.key,
    label: option.symbol,
    cryptoName: option.cryptoName,
  };
}

/** Sub-Address 工具栏币种选择器 · EgCryptoTooltip currencyOptions。 */
export function buildWaasSubAddressCurrencyFilterOptions(): EgFilterFieldCurrencyOption[] {
  return WAAS_SUB_ADDRESS_CURRENCY_OPTIONS.map((option) => toFilterCurrencyOption(option));
}

export function buildWaasSubAddressCurrencyPickerValue(
  currencyKey: string,
  networkKey: string,
): string {
  const trimmedNetwork = networkKey.trim();
  if (!trimmedNetwork) return currencyKey;
  return `${currencyKey}:${trimmedNetwork}`;
}

export function parseWaasSubAddressCurrencyPickerValue(raw: string): {
  currencyKey: string;
  networkKey: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { currencyKey: '', networkKey: '' };
  const [currencyKey, networkKey = ''] = trimmed.split(':');
  return { currencyKey: currencyKey ?? '', networkKey };
}
