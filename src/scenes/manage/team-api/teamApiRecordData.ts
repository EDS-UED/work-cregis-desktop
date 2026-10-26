import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { formatTeamApiCreatorDisplay } from './teamApiMockData';
import { teamApiConfigs } from './teamApiStore';

function configToRow(config: (typeof teamApiConfigs.value)[number]): PaymentEngineRecordRow {
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
    ruleEnabled: config.enabled,
    logOperatorName: config.creatorName,
    webhookCreatorEmail: config.creatorEmail,
    webhookCreatorDisplay: formatTeamApiCreatorDisplay(
      config.creatorName,
      config.creatorEmail,
    ),
    teamApiKeyMasked: config.apiKeyMasked,
    teamApiKeyFull: config.apiKeyFull,
    teamApiSecretKey: config.secretKey,
    teamApiBaseUrl: config.baseUrl,
    teamApiPermissionsKey: config.permissionsKey,
    teamApiIpWhitelist: config.ipWhitelist,
    teamApiAuthType: config.authType,
  };
}

export function teamApiConfigToRow(config: (typeof teamApiConfigs.value)[number]): PaymentEngineRecordRow {
  return configToRow(config);
}

export function buildManageTeamApiRecordRows(
  menuItem: string,
  _count?: number,
): PaymentEngineRecordRow[] {
  if (menuItem !== 'API Manage') return [];
  return [...teamApiConfigs.value]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(configToRow);
}
