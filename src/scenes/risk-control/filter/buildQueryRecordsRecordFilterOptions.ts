import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
} from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import { mapRowNetworkLabelToFilterKey } from '@/scenes/shared/mapRowNetworkLabelToFilterKey';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import {
  QUERY_RECORDS_OBJECT_KEYS,
  QUERY_RECORDS_PROVIDER_KEYS,
  QUERY_RECORDS_RESULT_KEYS,
  QUERY_RECORDS_TYPE_KEYS,
} from './queryRecordsRecordFilterCatalog';
import {
  QUERY_RECORDS_CURRENCY_NAMESPACE,
  QUERY_RECORDS_OBJECT_NAMESPACE,
  QUERY_RECORDS_PROVIDER_NAMESPACE,
  QUERY_RECORDS_RESULT_NAMESPACE,
  QUERY_RECORDS_TYPE_NAMESPACE,
} from './queryRecordsRecordFilterNamespaces';

type CurrencyFilterAccumulator = {
  id: string;
  label: string;
  cryptoName: string;
  networks: Map<string, { key: string; label: string; cryptoName: string }>;
};

export function buildQueryRecordsResultFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return QUERY_RECORDS_RESULT_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(QUERY_RECORDS_RESULT_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildQueryRecordsProviderFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return QUERY_RECORDS_PROVIDER_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(QUERY_RECORDS_PROVIDER_NAMESPACE, key),
    label: key,
  }));
}

export function buildQueryRecordsObjectFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return QUERY_RECORDS_OBJECT_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(QUERY_RECORDS_OBJECT_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildQueryRecordsTypeFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return QUERY_RECORDS_TYPE_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(QUERY_RECORDS_TYPE_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildQueryRecordsWaasProjectFilterOptions(
  rowCount: number,
): EgFilterFieldDropdownOption[] {
  const rows = buildRiskControlRecordRows('AML', rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];

  for (const row of rows) {
    const label = String(row.amlWaasProject ?? '').trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push({ id: label, label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}

export function buildQueryRecordsCurrencyFilterOptions(
  rowCount: number,
): EgFilterFieldCurrencyOption[] {
  const rows = buildRiskControlRecordRows('AML', rowCount);
  const bySymbol = new Map<string, CurrencyFilterAccumulator>();

  for (const row of rows) {
    const symbol = String(row.amlCurrencySymbol ?? '').trim();
    const cryptoName = String(row.amlCurrencyCryptoName ?? '').trim();
    const networkLabel = String(row.amlCurrencyNetworkLabel ?? row.amlNetworkLabel ?? '').trim();
    if (!symbol || !cryptoName) continue;

    if (!bySymbol.has(symbol)) {
      bySymbol.set(symbol, {
        id: resolveDataListFilterOptionId(QUERY_RECORDS_CURRENCY_NAMESPACE, symbol),
        label: symbol,
        cryptoName,
        networks: new Map(),
      });
    }

    if (!networkLabel) continue;

    const networkKey = mapRowNetworkLabelToFilterKey(networkLabel);
    if (!networkKey) continue;

    const entry = bySymbol.get(symbol)!;
    if (!entry.networks.has(networkKey)) {
      entry.networks.set(networkKey, {
        key: networkKey,
        label: networkLabel,
        cryptoName,
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
    .sort((left, right) => compareDataListFilterCurrencyLabels(left.label, right.label));
}

export function resolveQueryRecordsResultFilterId(labelKey: string | undefined): string {
  const key = labelKey?.trim() || 'Safe';
  return resolveDataListFilterOptionId(QUERY_RECORDS_RESULT_NAMESPACE, key);
}

export function resolveQueryRecordsProviderFilterId(provider: string | undefined): string {
  const label = String(provider ?? '').trim() || 'Regtank';
  return resolveDataListFilterOptionId(QUERY_RECORDS_PROVIDER_NAMESPACE, label);
}

export function resolveQueryRecordsObjectFilterId(objectKey: string | undefined): string {
  const key = objectKey?.trim() || 'Address';
  return resolveDataListFilterOptionId(QUERY_RECORDS_OBJECT_NAMESPACE, key);
}

export function resolveQueryRecordsTypeFilterId(typeKey: string | undefined): string {
  const key = typeKey?.trim() || 'Automatic';
  return resolveDataListFilterOptionId(QUERY_RECORDS_TYPE_NAMESPACE, key);
}

export function resolveQueryRecordsCurrencyFilterId(symbol: string | undefined): string {
  const label = String(symbol ?? '').trim();
  return resolveDataListFilterOptionId(QUERY_RECORDS_CURRENCY_NAMESPACE, label);
}
