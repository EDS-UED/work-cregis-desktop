import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from './dataListFilterOptionUtils';
import { mapRowNetworkLabelToFilterKey } from './mapRowNetworkLabelToFilterKey';
import type { PaymentEngineRecordRow } from '../payment-engine/paymentEngineRecordConfigs';
import { resolveDataListCryptoName } from './resolveDataListCryptoName';

type CurrencyFilterAccumulator = {
  id: string;
  label: string;
  cryptoName: EgFilterFieldCurrencyOption['cryptoName'];
  networks: Map<string, { key: string; label: string; cryptoName: EgFilterFieldCurrencyOption['cryptoName'] }>;
};

function resolveRowFilterCryptoName(row: PaymentEngineRecordRow, symbol: string) {
  const normalizedSymbol = symbol.trim();
  const rowCurrencySymbol = String(row.currencySymbol ?? '').trim();
  const rowOrderSymbol = String(row.orderSymbol ?? '').trim();
  const rowReceivedSymbol = String(row.receivedSymbol ?? '').trim();
  const explicit =
    normalizedSymbol === rowCurrencySymbol
    || normalizedSymbol === rowOrderSymbol
    || normalizedSymbol === rowReceivedSymbol
      ? row.currencyCryptoName
      : undefined;

  return resolveDataListCryptoName(normalizedSymbol, explicit);
}

function accumulateRowCurrency(
  bySymbol: Map<string, CurrencyFilterAccumulator>,
  row: PaymentEngineRecordRow,
  rowIndex: number,
  pickSymbol: (row: PaymentEngineRecordRow) => string | undefined,
) {
  const symbol = String(pickSymbol(row) ?? '').trim();
  if (!symbol) return;

  const cryptoName = resolveRowFilterCryptoName(row, symbol);

  const showNetwork = Boolean(row.currencyShowNetwork);
  const networkLabel = String(row.currencyNetwork ?? row.networkLabel ?? '').trim();

  if (!bySymbol.has(symbol)) {
    bySymbol.set(symbol, {
      id: `${rowIndex}-${symbol.toLowerCase()}`,
      label: symbol,
      cryptoName,
      networks: new Map(),
    });
  }

  if (!showNetwork || !networkLabel) return;

  const networkKey = mapRowNetworkLabelToFilterKey(networkLabel);
  if (!networkKey) return;

  const entry = bySymbol.get(symbol)!;
  if (!entry.networks.has(networkKey)) {
    entry.networks.set(networkKey, { key: networkKey, label: networkLabel, cryptoName });
  }
}

/** 从 DataList mock 行扫描币种，生成 EgFilter 币种选项（禁止 EDS 全量 catalog）。 */
export function buildDataListCurrencyFilterOptionsFromRows(
  rows: PaymentEngineRecordRow[],
  pickSymbol: (row: PaymentEngineRecordRow) => string | undefined = (row) =>
    row.currencySymbol ?? row.orderSymbol,
): EgFilterFieldCurrencyOption[] {
  const bySymbol = new Map<string, CurrencyFilterAccumulator>();

  rows.forEach((row, rowIndex) => accumulateRowCurrency(bySymbol, row, rowIndex, pickSymbol));

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
