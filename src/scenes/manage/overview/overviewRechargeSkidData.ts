import type { CryptoName } from '@eds/desktop-components';
import { AML_QUERY_NETWORK_OPTIONS } from '@/scenes/risk-control/riskControlAmlQueryOptions';
import {
  resolveSampleAddressForSymbol,
  type CryptoAddressFamily,
} from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';

export const OVERVIEW_RECHARGE_CURRENCY = {
  symbol: 'USDT',
  cryptoName: 'eds-usdt-tether usd' as CryptoName,
} as const;

export type OverviewRechargeNetworkKey = 'tron-trc20' | 'eth-erc20' | 'bsc';

export type OverviewRechargeNetworkOption = {
  key: OverviewRechargeNetworkKey;
  labelCatalog: string;
  amlNetworkLabel: (typeof AML_QUERY_NETWORK_OPTIONS)[number];
};

/** 充值侧栏仅支持 USDT 的三条网络。 */
export const OVERVIEW_RECHARGE_NETWORK_OPTIONS: readonly OverviewRechargeNetworkOption[] = [
  {
    key: 'tron-trc20',
    labelCatalog: 'Tron(TRC)(TRC20)',
    amlNetworkLabel: 'TRON (TRX)',
  },
  {
    key: 'eth-erc20',
    labelCatalog: 'Ethereum(ERC20)',
    amlNetworkLabel: 'Ethereum',
  },
  {
    key: 'bsc',
    labelCatalog: 'Binance Smart Chain(BEP20)',
    amlNetworkLabel: 'Binance Smart Chain',
  },
];

export const OVERVIEW_RECHARGE_DEFAULT_NETWORK_KEY: OverviewRechargeNetworkKey = 'tron-trc20';

const RECHARGE_NETWORK_KEY_TO_ADDRESS_FAMILY: Record<
  OverviewRechargeNetworkKey,
  CryptoAddressFamily
> = {
  'eth-erc20': 'evm',
  bsc: 'evm',
  'tron-trc20': 'trx',
};

export function resolveOverviewRechargeDepositAddress(
  networkKey: OverviewRechargeNetworkKey,
): string {
  const optionIndex = OVERVIEW_RECHARGE_NETWORK_OPTIONS.findIndex(
    (item) => item.key === networkKey,
  );
  const index = optionIndex >= 0 ? optionIndex + 1 : 1;
  const family = RECHARGE_NETWORK_KEY_TO_ADDRESS_FAMILY[networkKey] ?? 'evm';
  return resolveSampleAddressForSymbol('USDT', index, family);
}

export const OVERVIEW_RECHARGE_MINIMUM_DISPLAY = '10 USDT';

export type OverviewGasRechargeAccountKey = 'trx' | 'eth' | 'bnb' | 'pol' | 'sol';

export type OverviewGasRechargeAccountOption = {
  key: OverviewGasRechargeAccountKey;
  titleKey: string;
  cryptoName: CryptoName;
  symbol: string;
  addressFamily: CryptoAddressFamily;
  /** 地址卡片底部最低充值展示（填入 Overview Recharge Minimum Hint `{amount}`）。 */
  minimumDisplay: string;
};

/** 总览 Gas 充值侧栏网络，与 Gas 账户列表一一对应。 */
export const OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS: readonly OverviewGasRechargeAccountOption[] =
  [
    {
      key: 'trx',
      titleKey: 'TRX Gas Account',
      cryptoName: 'eds-trx-tron',
      symbol: 'TRX',
      addressFamily: 'trx',
      minimumDisplay: '10 TRX',
    },
    {
      key: 'eth',
      titleKey: 'ETH Gas Account',
      cryptoName: 'eds-eth-ethereum',
      symbol: 'ETH',
      addressFamily: 'evm',
      minimumDisplay: '0.001 ETH',
    },
    {
      key: 'bnb',
      titleKey: 'BNB Gas Account',
      cryptoName: 'eds-bnb-binance coin',
      symbol: 'BNB',
      addressFamily: 'evm',
      minimumDisplay: '0.001 BNB',
    },
    {
      key: 'pol',
      titleKey: 'POL Gas Account',
      cryptoName: 'eds-pol-polygon',
      symbol: 'POL',
      addressFamily: 'evm',
      minimumDisplay: '1 POL',
    },
    {
      key: 'sol',
      titleKey: 'SOL Gas Account',
      cryptoName: 'eds-sol-solana',
      symbol: 'SOL',
      addressFamily: 'sol',
      minimumDisplay: '0.01 SOL',
    },
  ];

export const OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY: OverviewGasRechargeAccountKey = 'trx';

export function resolveOverviewGasRechargeDepositAddress(
  accountKey: OverviewGasRechargeAccountKey,
): string {
  const optionIndex = OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS.findIndex(
    (item) => item.key === accountKey,
  );
  const option = OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS[optionIndex];
  if (!option) {
    return resolveOverviewGasRechargeDepositAddress(OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY);
  }
  const index = optionIndex + 1;
  return resolveSampleAddressForSymbol(option.symbol, index, option.addressFamily);
}
