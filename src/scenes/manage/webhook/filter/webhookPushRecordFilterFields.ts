import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildWebhookPushRecordEventFilterOptions,
  buildWebhookPushRecordStatusFilterOptions,
} from './buildWebhookPushRecordFilterOptions';
import {
  WEBHOOK_PUSH_RECORD_FILTER_FIELD_LABEL_KEYS,
  type WebhookPushRecordFilterFieldId,
} from './webhookPushRecordFilterFieldLabelKeys';

const WEBHOOK_PUSH_RECORD_FILTER_FIELD_IDS: readonly WebhookPushRecordFilterFieldId[] = [
  'webhookPushEvent',
  'webhookPushStatus',
  'webhookPushTime',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: WebhookPushRecordFilterFieldId,
): string {
  return translate(WEBHOOK_PUSH_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
): Record<WebhookPushRecordFilterFieldId, EgFilterField> {
  return {
    webhookPushEvent: {
      id: 'webhookPushEvent',
      label: filterLabel(translate, 'webhookPushEvent'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildWebhookPushRecordEventFilterOptions(translate),
    },
    webhookPushStatus: {
      id: 'webhookPushStatus',
      label: filterLabel(translate, 'webhookPushStatus'),
      kind: 'status',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: buildWebhookPushRecordStatusFilterOptions(translate),
    },
    webhookPushTime: {
      id: 'webhookPushTime',
      label: filterLabel(translate, 'webhookPushTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const WEBHOOK_PUSH_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildWebhookPushRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  void resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount('Push Records'),
  );
  const catalog = buildFieldCatalog(translate);
  return WEBHOOK_PUSH_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
