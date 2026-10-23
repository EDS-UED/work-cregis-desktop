import type { EgFilterFieldDropdownOption, EgFilterFieldStatusOption, TagStatus } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  WEBHOOK_PUSH_RECORD_EVENT_KEYS,
  WEBHOOK_PUSH_RECORD_STATUS_KEYS,
} from './webhookPushRecordFilterCatalog';
import {
  WEBHOOK_PUSH_RECORD_EVENT_NAMESPACE,
  WEBHOOK_PUSH_RECORD_STATUS_NAMESPACE,
} from './webhookPushRecordFilterNamespaces';

const WEBHOOK_PUSH_STATUS_TAG_BY_KEY: Record<
  (typeof WEBHOOK_PUSH_RECORD_STATUS_KEYS)[number],
  TagStatus
> = {
  Failed: 'danger',
  Success: 'success',
};

export function buildWebhookPushRecordEventFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return WEBHOOK_PUSH_RECORD_EVENT_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(WEBHOOK_PUSH_RECORD_EVENT_NAMESPACE, key),
    label: translate(key),
  }));
}

export function buildWebhookPushRecordStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldStatusOption[] {
  return WEBHOOK_PUSH_RECORD_STATUS_KEYS.map((key) => ({
    id: resolveDataListFilterOptionId(WEBHOOK_PUSH_RECORD_STATUS_NAMESPACE, key),
    label: translate(key),
    status: WEBHOOK_PUSH_STATUS_TAG_BY_KEY[key],
  }));
}

export function resolveWebhookPushRecordEventFilterId(eventKey: string | undefined): string {
  const key = String(eventKey ?? '').trim() || WEBHOOK_PUSH_RECORD_EVENT_KEYS[0];
  return resolveDataListFilterOptionId(WEBHOOK_PUSH_RECORD_EVENT_NAMESPACE, key);
}

export function resolveWebhookPushRecordStatusFilterId(
  pushStatus: 'success' | 'failed' | undefined,
): string {
  const labelKey = pushStatus === 'success' ? 'Success' : 'Failed';
  return resolveDataListFilterOptionId(WEBHOOK_PUSH_RECORD_STATUS_NAMESPACE, labelKey);
}
