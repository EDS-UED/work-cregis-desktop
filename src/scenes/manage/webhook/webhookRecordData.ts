import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { formatWebhookCreatorDisplay } from './webhookMockData';
import { webhookConfigs, webhookPushRecords } from './webhookStore';

function configToRow(config: (typeof webhookConfigs.value)[number]): PaymentEngineRecordRow {
  return {
    id: config.id,
    merchantOrderId: config.id,
    status: 'success',
    createdAt: config.createdAt,
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: config.name,
    logOperatorName: config.creatorName,
    webhookCreatorEmail: config.creatorEmail,
    webhookCreatorDisplay: formatWebhookCreatorDisplay(
      config.creatorName,
      config.creatorEmail,
    ),
    ruleEnabled: config.enabled,
    callbackUrl: config.endpointUrl,
    webhookEventKey: config.eventKey,
    webhookEndpointVerified: config.endpointVerified,
    webhookSecretKey: config.secretKey,
  };
}

function pushStatusSortWeight(status: string | undefined): number {
  if (status === 'failed') return 0;
  return 1;
}

function pushToRow(record: (typeof webhookPushRecords.value)[number]): PaymentEngineRecordRow {
  return {
    id: record.id,
    merchantOrderId: record.id,
    status: 'success',
    createdAt: record.lastPushAt,
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: record.webhookName,
    callbackUrl: record.endpointUrl,
    webhookEventKey: record.eventKey,
    webhookPushStatusKey: record.pushStatus,
    webhookPushFailureReasonKey: record.failureReasonKey,
    webhookPushPayloadJson: record.payloadJson,
    webhookPushAttemptCount: record.pushAttemptCount,
    webhookAmlEventId: record.amlEventId,
    webhookManuallyRetried: record.manuallyRetried,
  };
}

export function buildManageWebhookRecordRows(
  menuItem: string,
  _count?: number,
): PaymentEngineRecordRow[] {
  if (menuItem === 'Webhook Config') {
    return [...webhookConfigs.value]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(configToRow);
  }

  if (menuItem === 'Push Records') {
    return [...webhookPushRecords.value]
      .sort((a, b) => {
        const weightDiff =
          pushStatusSortWeight(a.pushStatus) - pushStatusSortWeight(b.pushStatus);
        if (weightDiff !== 0) return weightDiff;
        return b.lastPushAt.localeCompare(a.lastPushAt);
      })
      .map(pushToRow);
  }

  return [];
}
