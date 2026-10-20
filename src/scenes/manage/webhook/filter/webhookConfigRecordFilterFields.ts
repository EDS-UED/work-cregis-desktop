import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildWebhookConfigCreatorFilterOptions } from './buildWebhookConfigCreatorFilterOptions';
import { buildWebhookConfigRecordStatusFilterOptions } from './buildWebhookConfigRecordFilterOptions';
import {
  WEBHOOK_CONFIG_RECORD_FILTER_FIELD_LABEL_KEYS,
  type WebhookConfigRecordFilterFieldId,
} from './webhookConfigRecordFilterFieldLabelKeys';

const WEBHOOK_CONFIG_RECORD_FILTER_FIELD_IDS: readonly WebhookConfigRecordFilterFieldId[] = [
  'webhookCreator',
  'webhookStatus',
  'webhookCreatedTime',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: WebhookConfigRecordFilterFieldId,
): string {
  return translate(WEBHOOK_CONFIG_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<WebhookConfigRecordFilterFieldId, EgFilterField> {
  const memberOptions = buildWebhookConfigCreatorFilterOptions(rowCount);

  return {
    webhookCreator: {
      id: 'webhookCreator',
      label: filterLabel(translate, 'webhookCreator'),
      kind: 'member',
      selectionMode: 'single',
      showTypeTabs: false,
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions,
    },
    webhookStatus: {
      id: 'webhookStatus',
      label: filterLabel(translate, 'webhookStatus'),
      kind: 'status',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: buildWebhookConfigRecordStatusFilterOptions(translate),
    },
    webhookCreatedTime: {
      id: 'webhookCreatedTime',
      label: filterLabel(translate, 'webhookCreatedTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const WEBHOOK_CONFIG_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildWebhookConfigRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount('Webhook Config'),
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return WEBHOOK_CONFIG_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
