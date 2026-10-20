import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveWebhookPushRecordStatusKey,
  resolveWebhookPushRecordStatusLabelKey,
  resolveWebhookPushRecordStatusTagStatus,
} from './webhookPushRecordStatusLabels';

function resolvePushStatusTag(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): { label: string; status: TagStatus } {
  const key = resolveWebhookPushRecordStatusKey(row);
  if (key === 'retrying') {
    const attempt = row.webhookPushRetryAttempt ?? 1;
    return {
      label: translate('Retrying push progress label')
        .replace('{current}', String(attempt))
        .replace('{total}', '3'),
      status: 'warning',
    };
  }
  return {
    label: translate(resolveWebhookPushRecordStatusLabelKey(key)),
    status: resolveWebhookPushRecordStatusTagStatus(key),
  };
}

export function buildWebhookPushStatusDetailItem(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  const tag = resolvePushStatusTag(row, translate);
  return {
    ...createDetailApplyItemRow('status', {
      key: 'webhook-push-status',
      title: translate('Push Status'),
      tag: tag.label,
    }),
    tagFamily: 'status',
    tagStatus: tag.status,
    valueTagOnly: true,
    value: '',
  };
}

export function buildWebhookPushDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const items: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('text', {
        key: 'webhook-push-event-type',
        title: translate('Event Type'),
        value: translate(row.webhookEventKey ?? 'Dangerous transaction'),
      }),
      titleIcon: 'eds-business-type',
    },
    createDetailApplyItemRow('time', {
      key: 'webhook-push-time',
      title: translate('Last Push Time'),
      value: row.createdAt,
    }),
    createDetailApplyItemRow('ip', {
      key: 'webhook-push-endpoint',
      title: translate('Webhook endpoint URL label'),
      value: row.callbackUrl ?? '',
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'webhook-push-attempt-count',
        title: translate('Push attempt count'),
        value: String(row.webhookPushAttemptCount ?? 0),
      }),
      titleIcon: 'eds-numbers123',
    },
  ];

  const showFailure =
    row.webhookPushStatusKey === 'failed' || row.webhookPushStatusKey === 'retrying';

  if (showFailure) {
    items.push(
      createDetailApplyItemRow('reason', {
        key: 'webhook-push-failure-reason',
        title: translate('Failure Reason'),
        value: translate(
          row.webhookPushFailureReasonKey ?? 'Webhook push failed: connection timed out',
        ),
      }),
    );
  }

  return [{ key: 'webhook-push-detail', items }];
}

export function webhookPushDetailShowsRequestContent(row: PaymentEngineRecordRow): boolean {
  return Boolean(row.webhookPushPayloadJson?.trim());
}

export function resolveWebhookPushDetailHeadlineStatus(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): { label: string; status: TagStatus } {
  return resolvePushStatusTag(row, translate);
}
