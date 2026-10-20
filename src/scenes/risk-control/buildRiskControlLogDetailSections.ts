import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  buildRiskControlCurrencyConditionsItem,
  buildRiskControlExpandedCurrencyValueEntries,
} from './buildRiskControlCurrencyDetailItem';
import { resolveRiskControlLogRecordDetail } from './riskControlLogDetailData';

export const LOG_TRIGGER_OPERATOR_ITEM_KEY = 'log-trigger-operator';
export const LOG_TEAM_API_CREATOR_ITEM_KEY = 'log-team-api-creator';
export const LOG_CURRENCIES_ITEM_KEY = 'log-currencies';

export function buildLogExpandedCurrencyValueEntries(
  detail: ReturnType<typeof resolveRiskControlLogRecordDetail>,
  translate: (key: string) => string,
) {
  return buildRiskControlExpandedCurrencyValueEntries(
    detail.currencyConditions,
    translate,
  );
}

function buildLogCurrencyConditionsItem(
  detail: ReturnType<typeof resolveRiskControlLogRecordDetail>,
  translate: (key: string) => string,
): DetailItemData | null {
  return buildRiskControlCurrencyConditionsItem({
    itemKey: LOG_CURRENCIES_ITEM_KEY,
    title: translate('Initiating Currency'),
    conditions: detail.currencyConditions,
    hiddenCount: detail.hiddenCurrencyConditionCount,
    translate,
  });
}

function buildHitStrategyItems(
  detail: ReturnType<typeof resolveRiskControlLogRecordDetail>,
  translate: (key: string) => string,
): DetailItemData[] {
  const currencyItem = buildLogCurrencyConditionsItem(detail, translate);

  const items: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('text', {
        key: 'log-strategy-name',
        title: translate('Strategy Name'),
        value: detail.strategyName,
      }),
      titleIcon: 'eds-title',
    },
    {
      ...createDetailApplyItemRow('time', {
        key: 'log-strategy-schedule',
        title: translate('Operation Time'),
        value: translate(detail.scheduleLabelKey),
      }),
      titleIcon: 'eds-calendar-pointer',
    },
  ];

  if (currencyItem) {
    items.push(currencyItem);
  }

  return items;
}

function buildStandardLogDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolveRiskControlLogRecordDetail(row);

  return [
    {
      key: 'log-trigger-strategy',
      showDivider: true,
      items: [
        createDetailApplyItemRow('type', {
          key: 'log-trigger-type',
          title: translate('Type'),
          value: translate(detail.triggerTypeKey),
        }),
        {
          ...createDetailApplyItemRow('text', {
            key: 'log-trigger-action',
            title: translate('Executed Action'),
            value: translate(detail.executedActionKey),
          }),
          titleIcon: 'eds-arrow-send-all-email',
        },
        {
          ...createDetailApplyItemRow('initiated-by', {
            key: LOG_TRIGGER_OPERATOR_ITEM_KEY,
            title: translate('Operator'),
            value: detail.operatorName,
            valueSymbolAvatarName: detail.operatorAvatarName,
            valueSecondary: detail.operatorEmailMasked,
            valueDeviceInfo: detail.deviceInfo,
          }),
          titleIcon: 'eds-user-pointer',
        },
        {
          ...createDetailApplyItemRow('text', {
            key: 'log-trigger-device',
            title: translate('Device'),
            value: detail.deviceLabel,
          }),
          titleIcon: 'eds-laptop',
          showValueCopy: true,
        },
        {
          ...createDetailApplyItemRow('time', {
            key: 'log-trigger-operation-time',
            title: translate('Operation Time'),
            value: detail.operationTime,
          }),
          titleIcon: 'eds-calendar-pointer',
        },
        createDetailApplyItemRow('ip', {
          key: 'log-trigger-ip',
          title: translate('IP Address'),
          value: detail.ipLocationLabel,
        }),
      ],
    },
    {
      key: 'log-hit-strategy-list',
      title: translate('Hit Strategy List'),
      items: buildHitStrategyItems(detail, translate),
    },
  ];
}

function buildTeamApiFieldItems(
  detail: ReturnType<typeof resolveRiskControlLogRecordDetail>,
  translate: (key: string) => string,
  prefix: string,
): DetailItemData[] {
  const snapshot = prefix === 'before'
    ? detail.apiSnapshotBefore
    : detail.apiSnapshotAfter;

  return [
    {
      ...createDetailApplyItemRow('text', {
        key: `log-team-api-${prefix}-name`,
        title: translate('API Name'),
        value: snapshot.apiName,
      }),
      titleIcon: 'eds-title',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: `log-team-api-${prefix}-permissions`,
        title: translate('Permissions'),
        value: snapshot.permissionsLabel,
      }),
      titleIcon: 'eds-task-list',
    },
    createDetailApplyItemRow('ip-whitelist', {
      key: `log-team-api-${prefix}-ip-whitelist`,
      title: translate('IP Whitelist'),
      value: snapshot.ipWhitelist,
    }),
  ];
}

function buildTeamApiCreateSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolveRiskControlLogRecordDetail(row);

  return [{
    key: 'log-team-api-create',
    items: [
      {
        ...createDetailApplyItemRow('initiated-by', {
          key: LOG_TEAM_API_CREATOR_ITEM_KEY,
          title: translate('Creator'),
          value: detail.creatorName,
          valueSymbolAvatarName: detail.creatorAvatarName,
          valueSecondary: detail.creatorEmailMasked,
          valueDeviceInfo: detail.creatorDeviceInfo,
        }),
        titleIcon: 'eds-user-pointer',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'log-team-api-gateway',
          title: translate('Gateway Server'),
          value: detail.gatewayServer,
        }),
        titleIcon: 'eds-title',
      },
      {
        ...createDetailApplyItemRow('text', {
          key: 'log-team-api-permissions',
          title: translate('Permissions'),
          value: detail.permissionsLabel,
        }),
        titleIcon: 'eds-task-list',
      },
      createDetailApplyItemRow('ip-whitelist', {
        key: 'log-team-api-ip-whitelist',
        title: translate('IP Whitelist'),
        value: detail.ipWhitelist,
      }),
      createDetailApplyItemRow('time', {
        key: 'log-team-api-operation-time',
        title: translate('Operation Time'),
        value: detail.operationTime,
      }),
    ],
  }];
}

function buildTeamApiUpdateSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolveRiskControlLogRecordDetail(row);

  return [
    {
      key: 'log-team-api-update-overview',
      showDivider: true,
      items: [
        {
          ...createDetailApplyItemRow('initiated-by', {
            key: LOG_TEAM_API_CREATOR_ITEM_KEY,
            title: translate('Creator'),
            value: detail.creatorName,
            valueSymbolAvatarName: detail.creatorAvatarName,
            valueSecondary: detail.creatorEmailMasked,
            valueDeviceInfo: detail.creatorDeviceInfo,
          }),
          titleIcon: 'eds-user-pointer',
        },
        createDetailApplyItemRow('time', {
          key: 'log-team-api-update-operation-time',
          title: translate('Operation Time'),
          value: detail.operationTime,
        }),
      ],
    },
    {
      key: 'log-team-api-before',
      title: translate('Before'),
      showDivider: true,
      items: buildTeamApiFieldItems(detail, translate, 'before'),
    },
    {
      key: 'log-team-api-after',
      title: translate('After'),
      items: buildTeamApiFieldItems(detail, translate, 'after'),
    },
  ];
}

export function buildRiskControlLogDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolveRiskControlLogRecordDetail(row);

  if (detail.kind === 'team-api-create') {
    return buildTeamApiCreateSections(row, translate);
  }

  if (detail.kind === 'team-api-update') {
    return buildTeamApiUpdateSections(row, translate);
  }

  return buildStandardLogDetailSections(row, translate);
}

export function resolveRiskControlLogRecordHeadline(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): string {
  const detail = resolveRiskControlLogRecordDetail(row);
  return translate(detail.headlineKey);
}
