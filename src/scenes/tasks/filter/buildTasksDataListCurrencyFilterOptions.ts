import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import type { CryptoName } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '../../shared/dataListFilterOptionUtils';
import { mapRowNetworkLabelToFilterKey } from '../../shared/mapRowNetworkLabelToFilterKey';
import { buildTasksListFieldCurrencyCustomize } from '../list-field/tasksListFieldCurrencyDefaults';
import { resolveCurrencyRowPreset } from '../list-field/tasksListFieldCurrencyRowData';

type CurrencyFilterAccumulator = {
  id: string;
  label: string;
  cryptoName: CryptoName;
  networks: Map<string, { key: string; label: string; cryptoName: CryptoName }>;
};

/** 从列表币种列同行索引构建 EgFilter 币种选项（仅列表出现的 symbol / 网络）。 */
export function buildTasksDataListCurrencyFilterOptions(
  rowCount: number,
  menuItem?: string,
): EgFilterFieldCurrencyOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const bySymbol = new Map<string, CurrencyFilterAccumulator>();

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    const preset = resolveCurrencyRowPreset(rowIndex);
    const customize = buildTasksListFieldCurrencyCustomize(rowIndex, '', menuItem);
    const symbol = preset.symbol;
    const showNetwork = Boolean(customize.showNetwork ?? preset.showNetwork);
    const networkLabel = String(customize.networkLabel ?? preset.networkLabel ?? '').trim();

    if (!bySymbol.has(symbol)) {
      bySymbol.set(symbol, {
        id: `${rowIndex}-${symbol.toLowerCase()}`,
        label: symbol,
        cryptoName: preset.cryptoName,
        networks: new Map(),
      });
    }

    if (!showNetwork || !networkLabel) continue;

    const networkKey = mapRowNetworkLabelToFilterKey(networkLabel);
    if (!networkKey) continue;

    const entry = bySymbol.get(symbol)!;
    if (!entry.networks.has(networkKey)) {
      entry.networks.set(networkKey, {
        key: networkKey,
        label: networkLabel,
        cryptoName: preset.cryptoName,
      });
    }
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
