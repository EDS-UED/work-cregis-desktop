import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  POLICY_SETTINGS_RECORD_STATUS_KEYS,
  POLICY_SETTINGS_RECORD_TYPE_KEYS,
} from './policySettingsRecordFilterCatalog';
import {
  POLICY_SETTINGS_RECORD_STATUS_NAMESPACE,
  POLICY_SETTINGS_RECORD_TYPE_NAMESPACE,
} from './policySettingsRecordFilterNamespaces';

export function buildPolicySettingsRecordTypeFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return POLICY_SETTINGS_RECORD_TYPE_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(POLICY_SETTINGS_RECORD_TYPE_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildPolicySettingsRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return POLICY_SETTINGS_RECORD_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(POLICY_SETTINGS_RECORD_STATUS_NAMESPACE, key),
    label: translate(key),
  }));
}

export function resolvePolicySettingsRecordTypeFilterId(
  typeKey: string | undefined,
): string {
  const key = String(typeKey ?? '').trim() || POLICY_SETTINGS_RECORD_TYPE_KEYS[0];
  return resolveDataListFilterOptionId(POLICY_SETTINGS_RECORD_TYPE_NAMESPACE, key);
}

export function resolvePolicySettingsRecordStatusFilterId(
  enabled: boolean | undefined,
): string {
  const key = enabled ? 'Enabled' : 'Disabled';
  return resolveDataListFilterOptionId(POLICY_SETTINGS_RECORD_STATUS_NAMESPACE, key);
}
