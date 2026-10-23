/** 列表 networkLabel → EgFilter 币种条件 networkKey（与 applyEgFilterConditions 对齐）。 */
const ROW_NETWORK_LABEL_TO_FILTER_KEY: Record<string, string> = {
  aptos: 'aptos',
  arbitrum: 'arb',
  'arbitrum one': 'arb',
  'avalanche c': 'avax-c',
  base: 'base',
  'binance smart chain': 'bsc',
  'bnb smart chain': 'bsc',
  bitcoin: 'btc-omni',
  'bitcoin (omni)': 'btc-omni',
  cardano: 'ada',
  cronos: 'cronos',
  dogecoin: 'doge',
  ethereum: 'eth-erc20',
  'ethereum mainnet': 'eth-erc20',
  'ethereum mainnet (erc20)': 'eth-erc20',
  'ethereum classic': 'etc',
  filecoin: 'fil',
  hedera: 'hedera',
  linea: 'linea',
  'linea mainnet': 'linea',
  litecoin: 'ltc',
  optimism: 'optimism',
  polkadot: 'dot',
  polygon: 'polygon',
  ripple: 'xrp',
  sei: 'sei',
  solana: 'sol',
  stellar: 'xlm',
  sui: 'sui',
  ton: 'ton',
  'the open network': 'ton',
  tron: 'tron-trc20',
  'tron (trx)': 'tron-trc20',
  'tron (trc20)': 'tron-trc20',
  near: 'near',
  unichain: 'unichain',
};

export function mapRowNetworkLabelToFilterKey(networkLabel: string): string | undefined {
  const normalized = networkLabel.trim().toLowerCase();
  if (!normalized) return undefined;

  const exact = ROW_NETWORK_LABEL_TO_FILTER_KEY[normalized];
  if (exact) return exact;

  if (normalized.includes('bnb smart chain') || normalized.includes('binance smart chain') || normalized.includes('bsc')) {
    return 'bsc';
  }
  if (normalized.includes('the open network') || normalized === 'ton') return 'ton';
  if (normalized.includes('solana')) return 'sol';
  if (normalized.includes('arbitrum')) return 'arb';
  if (normalized.includes('ethereum classic')) return 'etc';
  if (normalized.includes('ethereum')) return 'eth-erc20';
  if (normalized.includes('tron')) return 'tron-trc20';
  if (normalized.includes('bitcoin')) return 'btc-omni';
  if (normalized.includes('polygon')) return 'polygon';
  if (normalized.includes('optimism')) return 'optimism';
  if (normalized.includes('avalanche')) return 'avax-c';
  if (normalized.includes('dogecoin') || normalized === 'doge') return 'doge';
  if (normalized.includes('litecoin') || normalized === 'ltc') return 'ltc';
  if (normalized.includes('cardano') || normalized === 'ada') return 'ada';
  if (normalized.includes('filecoin') || normalized === 'fil') return 'fil';
  if (normalized.includes('polkadot') || normalized === 'dot') return 'dot';
  if (normalized.includes('ripple') || normalized === 'xrp') return 'xrp';
  if (normalized.includes('stellar') || normalized === 'xlm') return 'xlm';
  if (normalized.includes('hedera') || normalized === 'hbar') return 'hedera';
  if (normalized.includes('cronos') || normalized === 'cro') return 'cronos';
  if (normalized.includes('aptos') || normalized === 'apt') return 'aptos';
  if (normalized === 'sui' || normalized.includes('sui')) return 'sui';
  if (normalized === 'sei' || normalized.includes('sei')) return 'sei';
  if (normalized === 'linea' || normalized.includes('linea')) return 'linea';
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
