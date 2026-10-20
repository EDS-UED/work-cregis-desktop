import type {
  CryptoName,
  EgFilterFieldCurrencyNetworkOption,
  EgFilterFieldCurrencyOption,
} from '@eds/desktop-components';

/**
 * 多链币种级联子菜单（顺序 / key / 链全名与 EDS `FILTER_CURRENCY_NETWORK_OPTIONS` 一致）。
 * 业务不消费 FILTER_CURRENCY_PRESETS 全量 catalog，仅对列表出现的多链 symbol 挂载此网络表。
 */
export const DATA_LIST_FILTER_CURRENCY_MULTI_CHAIN_NETWORKS: readonly EgFilterFieldCurrencyNetworkOption[] =
  [
    { key: 'btc-omni', label: 'Bitcoin', cryptoName: 'eds-btc-bitcoin' satisfies CryptoName },
    {
      key: 'eth-erc20',
      label: 'Ethereum Mainnet',
      cryptoName: 'Ethereum Mainnet' satisfies CryptoName,
    },
    { key: 'tron-trc20', label: 'Tron', cryptoName: 'eds-trx-tron' satisfies CryptoName },
    { key: 'sol', label: 'Solana', cryptoName: 'eds-sol-solana' satisfies CryptoName },
    { key: 'avax-c', label: 'Avalanche C', cryptoName: 'eds-avax-avalanche' satisfies CryptoName },
    { key: 'near', label: 'Near', cryptoName: 'eds-near-near protocol' satisfies CryptoName },
    { key: 'linea', label: 'Linea Mainnet', cryptoName: 'Linea Mainnet' satisfies CryptoName },
    { key: 'sei', label: 'Sei', cryptoName: 'Sei' satisfies CryptoName },
    {
      key: 'ton',
      label: 'The Open Network',
      cryptoName: 'The Open Network' satisfies CryptoName,
    },
    { key: 'base', label: 'Base', cryptoName: 'Ethereum Mainnet' satisfies CryptoName },
    {
      key: 'bsc',
      label: 'BNB Smart Chain',
      cryptoName: 'eds-bnb-binance coin' satisfies CryptoName,
    },
    { key: 'unichain', label: 'Unichain', cryptoName: 'Unichain' satisfies CryptoName },
    { key: 'arb', label: 'Arbitrum One', cryptoName: 'Arbitrum One' satisfies CryptoName },
  ];

/** 与 EDS `MULTI_CHAIN_SYMBOLS` 一致。 */
const MULTI_CHAIN_SYMBOLS = new Set(['USDT', 'USDC', 'MNT']);

/** 列表出现的多链 symbol 挂载 token → chain 级联（Multi-chain + 网络子菜单）。 */
export function enrichDataListCurrencyFilterOptionsWithMultiChain(
  options: readonly EgFilterFieldCurrencyOption[],
): EgFilterFieldCurrencyOption[] {
  const networkCount = DATA_LIST_FILTER_CURRENCY_MULTI_CHAIN_NETWORKS.length;

  return options.map((option) => {
    const symbol = option.label.trim().toUpperCase();
    if (!MULTI_CHAIN_SYMBOLS.has(symbol)) return option;

    return {
      id: option.id,
      label: option.label,
      cryptoName: option.cryptoName,
      multiChain: true,
      modeTag: '多链',
      messageText: String(networkCount),
      networks: DATA_LIST_FILTER_CURRENCY_MULTI_CHAIN_NETWORKS,
    };
  });
}
