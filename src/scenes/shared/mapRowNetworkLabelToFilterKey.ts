/** 列表 networkLabel → EgFilter 币种条件 networkKey（与 applyEgFilterConditions 对齐）。 */
const ROW_NETWORK_LABEL_TO_FILTER_KEY: Record<string, string> = {
  bitcoin: 'btc-omni',
  'bitcoin (omni)': 'btc-omni',
  ethereum: 'eth-erc20',
  'ethereum mainnet': 'eth-erc20',
  'ethereum mainnet (erc20)': 'eth-erc20',
  tron: 'tron-trc20',
  'tron (trc20)': 'tron-trc20',
  solana: 'sol',
  'avalanche c': 'avax-c',
  near: 'near',
  'linea mainnet': 'linea',
  sei: 'sei',
  'the open network': 'ton',
  base: 'base',
  'bnb smart chain': 'bsc',
  unichain: 'unichain',
  'arbitrum one': 'arb',
  polygon: 'polygon',
  optimism: 'optimism',
};

export function mapRowNetworkLabelToFilterKey(networkLabel: string): string | undefined {
  const normalized = networkLabel.trim().toLowerCase();
  if (!normalized) return undefined;

  const exact = ROW_NETWORK_LABEL_TO_FILTER_KEY[normalized];
  if (exact) return exact;

  if (normalized.includes('bnb smart chain') || normalized.includes('bsc')) return 'bsc';
  if (normalized.includes('the open network')) return 'ton';
  if (normalized.includes('solana')) return 'sol';
  if (normalized.includes('arbitrum')) return 'arb';
  if (normalized.includes('ethereum')) return 'eth-erc20';
  if (normalized.includes('tron')) return 'tron-trc20';
  if (normalized.includes('bitcoin')) return 'btc-omni';
  if (normalized.includes('polygon')) return 'polygon';
  if (normalized.includes('optimism')) return 'optimism';
  if (normalized.includes('avalanche')) return 'avax-c';
  if (normalized === 'base') return 'base';

  return undefined;
}

export const FILTER_NETWORK_KEY_TO_ROW_LABEL: Record<string, string> = {
  'btc-omni': 'Bitcoin',
  'eth-erc20': 'Ethereum',
  'tron-trc20': 'Tron',
  sol: 'Solana',
  'avax-c': 'Avalanche',
  near: 'Near',
  linea: 'Linea',
  sei: 'Sei',
  ton: 'The Open Network',
  base: 'Base',
  bsc: 'BNB Smart Chain',
  unichain: 'Unichain',
  arb: 'Arbitrum',
  polygon: 'Polygon',
  optimism: 'Optimism',
};
