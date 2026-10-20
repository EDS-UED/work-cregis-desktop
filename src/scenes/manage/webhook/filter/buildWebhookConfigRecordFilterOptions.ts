import type { EgFilterFieldStatusOption, TagStatus } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import { WEBHOOK_CONFIG_RECORD_STATUS_KEYS } from './webhookConfigRecordFilterCatalog';
import { WEBHOOK_CONFIG_RECORD_STATUS_NAMESPACE } from './webhookConfigRecordFilterNamespaces';

const WEBHOOK_CONFIG_STATUS_TAG_BY_KEY: Record<
  (typeof WEBHOOK_CONFIG_RECORD_STATUS_KEYS)[number],
  TagStatus
> = {
  Enabled: 'success',
  Disabled: 'invalid',
};

export function buildWebhookConfigRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldStatusOption[] {
  return WEBHOOK_CONFIG_RECORD_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(WEBHOOK_CONFIG_RECORD_STATUS_NAMESPACE, key),
    label: translate(key),
    status: WEBHOOK_CONFIG_STATUS_TAG_BY_KEY[key],
  }));
}

export function resolveWebhookConfigRecordStatusFilterId(
  enabled: boolean | undefined,
): string {
  const key = enabled ? 'Enabled' : 'Disabled';
  return resolveDataListFilterOptionId(WEBHOOK_CONFIG_RECORD_STATUS_NAMESPACE, key);
}
