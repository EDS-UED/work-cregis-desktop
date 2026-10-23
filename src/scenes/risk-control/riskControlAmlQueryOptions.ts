import type { CryptoName } from '@eds/desktop-components';
import { mapRowNetworkLabelToFilterKey } from '@/scenes/shared/mapRowNetworkLabelToFilterKey';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';

export const AML_QUERY_TYPE_OPTIONS = [
  { id: 'address', labelKey: 'Address Query' },
  { id: 'transaction-hash', labelKey: 'Transaction Hash Query' },
] as const;

export type AmlQueryTypeId = (typeof AML_QUERY_TYPE_OPTIONS)[number]['id'];

export const AML_QUERY_DIRECTION_OPTIONS = [
  { id: 'inflow', labelKey: 'Inflow' },
  { id: 'outflow', labelKey: 'Outflow' },
] as const;

export type AmlQueryDirectionId = (typeof AML_QUERY_DIRECTION_OPTIONS)[number]['id'];

/** AML 网络 EgFlotationMenu 列表区最大高度（px）。 */
export const AML_QUERY_NETWORK_MENU_MAX_HEIGHT = 320;

/** AML 手动查询 / 黑名单创建等共用的链网络列表（展示名）。 */
export const AML_QUERY_NETWORK_OPTIONS = [
  'Aptos',
  'Arbitrum',
  'Avalanche C',
  'Base',
  'Binance Smart Chain',
  'Bitcoin',
  'Cardano',
  'Cronos',
  'Dogecoin',
  'Ethereum',
  'Ethereum Classic',
  'Filecoin',
  'Hedera',
  'Linea',
  'Litecoin',
  'Optimism',
  'Polkadot',
  'Polygon',
  'Ripple',
  'SEI',
  'Solana',
  'Stellar',
  'SUI',
  'TON',
  'TRON (TRX)',
] as const;

const AML_QUERY_NETWORK_CRYPTO_BY_FILTER_KEY: Record<string, CryptoName> = {
  aptos: 'eds-apt-aptos',
  arb: 'Arbitrum One',
  'avax-c': 'eds-avax-avalanche',
  base: 'eds-eth-ethereum',
  bsc: 'eds-bnb-binance coin',
  'btc-omni': 'eds-btc-bitcoin',
  ada: 'eds-ada-cardano',
  cronos: 'eds-cro-cronos',
  doge: 'eds-doge-dogecoin',
  'eth-erc20': 'eds-eth-ethereum',
  etc: 'eds-etc-ethereum classic',
  fil: 'eds-fil-filecoin',
  hedera: 'eds-hbar-hedera',
  linea: 'Linea Mainnet',
  ltc: 'eds-ltc-litecoin',
  optimism: 'Optimism',
  dot: 'eds-dot-polkadot',
  polygon: 'eds-matic-polygon',
  xrp: 'eds-xrp-ripple',
  sei: 'Sei',
  sol: 'eds-sol-solana',
  xlm: 'eds-xlm-stellar',
  sui: 'eds-sui-sui',
  ton: 'eds-ton-toncoin',
  'tron-trc20': 'eds-trx-tron',
};

const FILTER_KEY_SYMBOL_FALLBACK: Record<string, string> = {
  aptos: 'APT',
  cronos: 'CRO',
  doge: 'DOGE',
  etc: 'ETC',
  hedera: 'HBAR',
  ltc: 'LTC',
  dot: 'DOT',
  xrp: 'XRP',
  xlm: 'XLM',
  sui: 'SUI',
};

/** AML 手动查询网络菜单 EgFlotationMenuItem symbol-icon。 */
export function resolveAmlQueryNetworkCryptoName(networkLabel: string): CryptoName {
  const filterKey = mapRowNetworkLabelToFilterKey(networkLabel);
  if (filterKey) {
    const mapped = AML_QUERY_NETWORK_CRYPTO_BY_FILTER_KEY[filterKey];
    if (mapped) {
      return mapped;
    }
    const symbol = FILTER_KEY_SYMBOL_FALLBACK[filterKey];
    if (symbol) {
      const resolved = resolveCryptoNameFromSymbol(symbol);
      if (resolved) {
        return resolved;
      }
    }
  }
  return 'eds-usdt-tether usd';
}

export const AML_QUERY_PROVIDER_OPTIONS = [
  { id: 'elliptic', label: 'Elliptic', mark: 'E' },
  { id: 'regtank', label: 'Regtank', mark: 'R' },
] as const;

export type AmlQueryProviderId = (typeof AML_QUERY_PROVIDER_OPTIONS)[number]['id'];

export const AML_QUERY_FEE_DISPLAY = '1 USD';
