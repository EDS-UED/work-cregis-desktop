import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '../../shared/dataListFilterOptionUtils';
import { mapRowNetworkLabelToFilterKey } from '../../shared/mapRowNetworkLabelToFilterKey';
import { resolveDataListCryptoName } from '../../shared/resolveDataListCryptoName';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS } from './paymentRecordFilterCatalog';
import { resolvePaymentRecordPaymentCurrencyLabel } from './resolvePaymentRecordPaymentCurrencyLabel';

type PaymentCurrencyFilterAccumulator = {
  id: string;
  label: string;
  cryptoName: EgFilterFieldCurrencyOption['cryptoName'];
  networks: Map<
    string,
    { key: string; label: string; cryptoName: EgFilterFieldCurrencyOption['cryptoName'] }
  >;
};

const PAYMENT_CURRENCY_SUFFIX_TO_NETWORK_LABEL: Record<string, string> = {
  TRC20: 'Tron',
  ERC20: 'Ethereum Mainnet',
  BEP20: 'BNB Smart Chain',
  Polygon: 'Polygon',
  'Avalanche-C': 'Avalanche C',
  'Arbitrum One': 'Arbitrum One',
  Solana: 'Solana',
  Base: 'Base',
  Optimism: 'Optimism',
  BSC: 'BNB Smart Chain',
};

const PAYMENT_CURRENCY_NATIVE_LABELS: Record<string, { symbol: string; networkLabel: string }> = {
  Bitcoin: { symbol: 'BTC', networkLabel: 'Bitcoin' },
  Solana: { symbol: 'SOL', networkLabel: 'Solana' },
  Ethereum: { symbol: 'ETH', networkLabel: 'Ethereum Mainnet' },
  Base: { symbol: 'ETH', networkLabel: 'Base' },
  'Arbitrum One': { symbol: 'ETH', networkLabel: 'Arbitrum One' },
  Optimism: { symbol: 'ETH', networkLabel: 'Optimism' },
  TRON: { symbol: 'TRX', networkLabel: 'Tron' },
  'BNB-BSC': { symbol: 'BNB', networkLabel: 'BNB Smart Chain' },
};

function parsePaymentRecordPaymentCurrencyFilterLabel(
  label: string,
): { symbol: string; networkLabel: string } | null {
  const trimmed = label.trim();
  if (!trimmed) return null;

  const native = PAYMENT_CURRENCY_NATIVE_LABELS[trimmed];
  if (native) return native;

  const dashIndex = trimmed.indexOf('-');
  if (dashIndex <= 0) {
    return { symbol: trimmed, networkLabel: trimmed };
  }

  const symbol = trimmed.slice(0, dashIndex).trim();
  const suffix = trimmed.slice(dashIndex + 1).trim();
  const networkLabel = PAYMENT_CURRENCY_SUFFIX_TO_NETWORK_LABEL[suffix] ?? suffix;
  return { symbol, networkLabel };
}

function accumulatePaymentCurrencyLabel(
  bySymbol: Map<string, PaymentCurrencyFilterAccumulator>,
  label: string,
  rowIndex: number,
) {
  const parsed = parsePaymentRecordPaymentCurrencyFilterLabel(label);
  if (!parsed) return;

  const { symbol, networkLabel } = parsed;
  const cryptoName = resolveDataListCryptoName(symbol);

  if (!bySymbol.has(symbol)) {
    bySymbol.set(symbol, {
      id: `${rowIndex}-${symbol.toLowerCase()}`,
      label: symbol,
      cryptoName,
      networks: new Map(),
    });
  }

  const networkKey = mapRowNetworkLabelToFilterKey(networkLabel);
  if (!networkKey) return;

  const entry = bySymbol.get(symbol)!;
  if (!entry.networks.has(networkKey)) {
    entry.networks.set(networkKey, { key: networkKey, label: networkLabel, cryptoName });
  }
}

/** 支付记录 · 支付币种 EgCryptoTooltip 选项（catalog + 列表行，禁止 EDS 全量 catalog）。 */
export function buildPaymentRecordPaymentCurrencyFilterOptions(
  rows: readonly PaymentEngineRecordRow[],
): EgFilterFieldCurrencyOption[] {
  const bySymbol = new Map<string, PaymentCurrencyFilterAccumulator>();
  const labels = new Set<string>(PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS);

  for (const row of rows) {
    const derived = resolvePaymentRecordPaymentCurrencyLabel(row);
    if (derived) labels.add(derived);
  }

  let labelIndex = 0;
  for (const label of labels) {
    accumulatePaymentCurrencyLabel(bySymbol, label, labelIndex);
    labelIndex += 1;
  }

  return [...bySymbol.values()]
    .map((entry) => {
      const networks = [...entry.networks.values()];

      if (networks.length > 1) {
        return {
          id: entry.id,
          label: entry.label,
          cryptoName: entry.cryptoName,
          multiChain: true,
          modeTag: '多链',
          messageText: String(networks.length),
          networks,
        };
      }

      if (networks.length === 1) {
        return {
          id: entry.id,
          label: entry.label,
          cryptoName: entry.cryptoName,
          chainTagLabel: networks[0]?.label,
          networks,
        };
      }

      return {
        id: entry.id,
        label: entry.label,
        cryptoName: entry.cryptoName,
      };
    })
    .sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}
