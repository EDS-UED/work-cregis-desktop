import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import {
  AUTO_RULES_RECORD_PROVIDER_KEYS,
  AUTO_RULES_RECORD_STATUS_KEYS,
} from './autoRulesRecordFilterCatalog';
import {
  AUTO_RULES_RECORD_PROVIDER_NAMESPACE,
  AUTO_RULES_RECORD_STATUS_NAMESPACE,
} from './autoRulesRecordFilterNamespaces';

export function buildAutoRulesRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return AUTO_RULES_RECORD_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(AUTO_RULES_RECORD_STATUS_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildAutoRulesRecordProviderFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return AUTO_RULES_RECORD_PROVIDER_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(AUTO_RULES_RECORD_PROVIDER_NAMESPACE, key),
    label: key,
  }));
}

export function buildAutoRulesRecordWaasProjectFilterOptions(
  rowCount: number,
): EgFilterFieldDropdownOption[] {
  const rows = buildRiskControlRecordRows('Auto Rules', rowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];

  for (const row of rows) {
    const label = String(row.autoRuleWaasProject ?? '').trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push({ id: label, label });
  }

  return options.sort((left, right) =>
    compareDataListFilterCurrencyLabels(left.label, right.label),
  );
}

export function resolveAutoRulesRecordStatusFilterId(
  enabled: boolean | undefined,
): string {
  const key = enabled ? 'Enabled' : 'Disabled';
  return resolveDataListFilterOptionId(AUTO_RULES_RECORD_STATUS_NAMESPACE, key);
}

export function resolveAutoRulesRecordProviderFilterId(
  provider: string | undefined,
): string {
  const label = String(provider ?? '').trim() || 'Regtank';
  return resolveDataListFilterOptionId(AUTO_RULES_RECORD_PROVIDER_NAMESPACE, label);
}
