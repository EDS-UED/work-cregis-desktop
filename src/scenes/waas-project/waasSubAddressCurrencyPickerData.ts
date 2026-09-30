import type { CryptoName } from '@eds/desktop-components';
import { resolveCurrencyRowPreset } from '@/scenes/shared/egDataListMockData';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';

export type WaasSubAddressCurrencyNetwork = {
  key: string;
  label: string;
  cryptoName: CryptoName;
};

/** 多链级联子菜单网络项（顺序与 design 一致）。 */
export const WAAS_SUB_ADDRESS_NETWORK_OPTIONS: readonly WaasSubAddressCurrencyNetwork[] = [
  { key: 'btc-omni', label: 'Bitcoin (OMNI)', cryptoName: 'eds-btc-bitcoin' },
  { key: 'eth-erc20', label: 'Ethereum Mainnet (ERC20)', cryptoName: 'Ethereum Mainnet' },
  { key: 'tron-trc20', label: 'Tron (TRC20)', cryptoName: 'eds-trx-tron' },
  { key: 'sol', label: 'Solana', cryptoName: 'eds-sol-solana' },
  { key: 'avax-c', label: 'Avalanche C', cryptoName: 'eds-avax-avalanche' },
  { key: 'near', label: 'Near', cryptoName: 'eds-near-near protocol' },
  { key: 'linea', label: 'Linea Mainnet', cryptoName: 'Linea Mainnet' },
  { key: 'sei', label: 'Sei', cryptoName: 'Sei' },
  { key: 'ton', label: 'The Open Network', cryptoName: 'The Open Network' },
  { key: 'base', label: 'Base', cryptoName: 'Ethereum Mainnet' },
  { key: 'bsc', label: 'BNB Smart Chain', cryptoName: 'eds-bnb-binance coin' },
  { key: 'unichain', label: 'Unichain', cryptoName: 'Unichain' },
  { key: 'arb', label: 'Arbitrum One', cryptoName: 'Arbitrum One' },
];

export type WaasSubAddressCurrencyOption = {
  key: string;
  symbol: string;
  cryptoName: CryptoName;
  multiChain?: boolean;
  chainCount?: number;
  networks?: readonly WaasSubAddressCurrencyNetwork[];
};

export type WaasSubAddressCurrencySelection = {
  currencyKey: string;
  symbol: string;
  cryptoName: CryptoName;
  networkKey: string;
  networkLabel: string;
};

const MULTI_CHAIN_SYMBOLS = new Set(['USDT', 'USDC', 'MNT']);

function buildWaasSubAddressCurrencyOption(rowIndex: number): WaasSubAddressCurrencyOption {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const multiChain = MULTI_CHAIN_SYMBOLS.has(preset.symbol);

  return {
    key: `${rowIndex}-${preset.symbol.toLowerCase()}`,
    symbol: preset.symbol,
    cryptoName: preset.cryptoName,
    ...(multiChain
      ? {
          multiChain: true,
          chainCount: WAAS_SUB_ADDRESS_NETWORK_OPTIONS.length,
          networks: WAAS_SUB_ADDRESS_NETWORK_OPTIONS,
        }
      : {}),
  };
}

export const WAAS_SUB_ADDRESS_CURRENCY_OPTIONS: readonly WaasSubAddressCurrencyOption[] =
  Array.from({ length: PAYMENT_ENGINE_RECORD_ROW_COUNT }, (_, rowIndex) =>
    buildWaasSubAddressCurrencyOption(rowIndex),
  );

const DEFAULT_BTC_ROW_INDEX = WAAS_SUB_ADDRESS_CURRENCY_OPTIONS.findIndex(
  (option) => option.symbol === 'BTC',
);

const DEFAULT_OPTION =
  WAAS_SUB_ADDRESS_CURRENCY_OPTIONS[DEFAULT_BTC_ROW_INDEX >= 0 ? DEFAULT_BTC_ROW_INDEX : 0]!;

export const WAAS_SUB_ADDRESS_DEFAULT_SELECTION: WaasSubAddressCurrencySelection = {
  currencyKey: DEFAULT_OPTION.key,
  symbol: DEFAULT_OPTION.symbol,
  cryptoName: DEFAULT_OPTION.cryptoName,
  networkKey: '',
  networkLabel: '',
};

export function resolveWaasSubAddressCurrencyOption(
  currencyKey: string,
): WaasSubAddressCurrencyOption | undefined {
  return WAAS_SUB_ADDRESS_CURRENCY_OPTIONS.find((option) => option.key === currencyKey);
}

export function resolveWaasSubAddressDefaultNetwork(
  option: WaasSubAddressCurrencyOption,
): WaasSubAddressCurrencyNetwork {
  return option.networks?.[0] ?? WAAS_SUB_ADDRESS_NETWORK_OPTIONS[0]!;
}

export function parseWaasSubAddressCurrencyRowIndex(currencyKey: string): number {
  const match = currencyKey.match(/^(\d+)-/);
  return match ? Number.parseInt(match[1]!, 10) : 0;
}

export function resolveWaasSubAddressCurrencyPresetFromSelection(
  selection: WaasSubAddressCurrencySelection,
) {
  return resolveCurrencyRowPreset(parseWaasSubAddressCurrencyRowIndex(selection.currencyKey));
}
