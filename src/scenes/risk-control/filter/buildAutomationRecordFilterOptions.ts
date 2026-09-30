import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  AUTOMATION_RECORD_STATUS_KEYS,
  AUTOMATION_RECORD_TYPE_KEYS,
} from './automationRecordFilterCatalog';
import {
  AUTOMATION_RECORD_STATUS_NAMESPACE,
  AUTOMATION_RECORD_TYPE_NAMESPACE,
} from './automationRecordFilterNamespaces';

export function buildAutomationRecordTypeFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return AUTOMATION_RECORD_TYPE_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(AUTOMATION_RECORD_TYPE_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildAutomationRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return AUTOMATION_RECORD_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(AUTOMATION_RECORD_STATUS_NAMESPACE, key),
    label: translate(key),
  }));
}

export function resolveAutomationRecordTypeFilterId(
  typeKey: string | undefined,
): string {
  const key = String(typeKey ?? '').trim() || AUTOMATION_RECORD_TYPE_KEYS[0];
  return resolveDataListFilterOptionId(AUTOMATION_RECORD_TYPE_NAMESPACE, key);
}

export function resolveAutomationRecordStatusFilterId(
  enabled: boolean | undefined,
): string {
  const key = enabled ? 'Enabled' : 'Disabled';
  return resolveDataListFilterOptionId(AUTOMATION_RECORD_STATUS_NAMESPACE, key);
}
