export type WebhookConfigRecordFilterFieldId =
  | 'webhookCreator'
  | 'webhookStatus'
  | 'webhookCreatedTime';

export const WEBHOOK_CONFIG_RECORD_FILTER_FIELD_LABEL_KEYS: Record<
  WebhookConfigRecordFilterFieldId,
  string
> = {
  webhookCreator: 'Creator',
  webhookStatus: 'Status',
  webhookCreatedTime: 'Webhook Created Time',
};
