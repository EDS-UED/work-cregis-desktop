import type { CryptoName } from '@eds/desktop-components';
import { mapRowNetworkLabelToFilterKey } from '@/scenes/shared/mapRowNetworkLabelToFilterKey';

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

export const AML_QUERY_NETWORK_OPTIONS = [
  'Bitcoin',
  'Tron',
  'Base',
  'BNB Smart Chain',
  'Ethereum Mainnet',
] as const;

const AML_QUERY_NETWORK_CRYPTO_BY_FILTER_KEY: Record<string, CryptoName> = {
  'btc-omni': 'eds-btc-bitcoin',
  'eth-erc20': 'eds-eth-ethereum',
  'tron-trc20': 'eds-trx-tron',
  base: 'Ethereum Mainnet',
  bsc: 'eds-bnb-binance coin',
};

/** AML 手动查询网络菜单 EgFlotationMenuItem symbol-icon。 */
export function resolveAmlQueryNetworkCryptoName(networkLabel: string): CryptoName {
  const filterKey = mapRowNetworkLabelToFilterKey(networkLabel);
  if (filterKey && AML_QUERY_NETWORK_CRYPTO_BY_FILTER_KEY[filterKey]) {
    return AML_QUERY_NETWORK_CRYPTO_BY_FILTER_KEY[filterKey];
  }
  return 'eds-usdt-tether usd';
}

export const AML_QUERY_PROVIDER_OPTIONS = [
  { id: 'elliptic', label: 'Elliptic', mark: 'E' },
  { id: 'regtank', label: 'Regtank', mark: 'R' },
] as const;

export type AmlQueryProviderId = (typeof AML_QUERY_PROVIDER_OPTIONS)[number]['id'];

export const AML_QUERY_FEE_DISPLAY = '1 USD';
