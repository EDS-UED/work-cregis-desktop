export type WebhookPushRecordFilterFieldId =
  | 'webhookPushEvent'
  | 'webhookPushStatus'
  | 'webhookPushTime';

export const WEBHOOK_PUSH_RECORD_FILTER_FIELD_LABEL_KEYS: Record<
  WebhookPushRecordFilterFieldId,
  string
> = {
  webhookPushEvent: 'Event Type',
  webhookPushStatus: 'Push Status',
  webhookPushTime: 'Last Push Time',
};
