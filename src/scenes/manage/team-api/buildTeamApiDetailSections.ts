import {
  createDetailApplyItemRow,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { maskWebhookCreatorEmail } from '@/scenes/manage/webhook/webhookMockData';

export function resolveTeamApiDetailHeadlineStatus(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): { label: string; status: TagStatus } {
  const enabled = Boolean(row.ruleEnabled);
  return {
    label: translate(enabled ? 'Enable' : 'Disable'),
    status: enabled ? 'success' : 'invalid',
  };
}

export function buildTeamApiDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const creatorName = row.logOperatorName?.trim() || '—';
  const creatorEmail = row.webhookCreatorEmail?.trim() ?? '';
  const creatorEmailMasked = creatorEmail ? maskWebhookCreatorEmail(creatorEmail) : '—';

  return [{
    key: 'team-api-detail',
    items: [
      {
        ...createDetailApplyItemRow('initiated-by', {
          key: 'team-api-creator',
          title: translate('Creator'),
          value: creatorName,
          valueSymbolAvatarName: creatorName,
          valueSecondary: creatorEmailMasked,
          valueDeviceInfo: {
            deviceType: 'MacBook Pro',
            deviceId: 'M79D144YL4',
            ip: '192.168.1.230',
          },
        }),
        titleIcon: 'eds-user-pointer',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'team-api-api-key',
          title: translate('API Key'),
          value: row.teamApiKeyFull ?? row.teamApiKeyMasked ?? '—',
        }),
        titleIcon: 'eds-key',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'team-api-secret-key',
          title: translate('Secret Key'),
          value: row.teamApiSecretKey ?? '—',
        }),
        titleIcon: 'eds-key',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'team-api-base-url',
          title: translate('Base URL'),
          value: row.teamApiBaseUrl ?? '—',
        }),
        titleIcon: 'eds-link',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'team-api-permissions',
          title: translate('Permissions'),
          value: translate(row.teamApiPermissionsKey ?? 'Wallet'),
        }),
        titleIcon: 'eds-task-list',
      },
      {
        ...createDetailApplyItemRow('ip-whitelist', {
          key: 'team-api-ip-whitelist',
          title: translate('IP Whitelist'),
          value: row.teamApiIpWhitelist ?? '—',
        }),
        titleIcon: 'eds-location-compass',
      },
      createDetailApplyItemRow('time', {
        key: 'team-api-created-time',
        title: translate('Creation Time'),
        value: row.createdAt,
      }),
    ],
  }];
}
