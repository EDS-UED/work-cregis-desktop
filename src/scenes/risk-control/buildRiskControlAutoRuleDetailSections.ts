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
import { resolveRiskControlAutoRuleRecordDetail } from './riskControlAutoRuleDetailData';
import { autoRuleTeamMemberById } from './auto-rule/riskControlAutoRuleMemberOptions';

export const AUTO_RULE_CREATOR_ITEM_KEY = 'auto-rule-creator';
export const AUTO_RULE_ALERT_RECIPIENT_ITEM_KEY = 'auto-rule-alert-recipient';
export const AUTO_RULE_CURRENCIES_ITEM_KEY = 'auto-rule-currencies';

export {
  buildRiskControlCurrencyConditionValueEntries as buildAutoRuleCurrencyConditionValueEntries,
  formatRiskControlCurrencyConditionThresholdLabel as formatAutoRuleCurrencyConditionThresholdLabel,
} from './buildRiskControlCurrencyDetailItem';

export function buildAutoRuleExpandedCurrencyValueEntries(
  detail: ReturnType<typeof resolveRiskControlAutoRuleRecordDetail>,
  translate: (key: string) => string,
) {
  const thresholdLabelKey =
    detail.direction === 'outflow'
      ? 'Auto rule per payout amount threshold'
      : 'Auto rule collection amount threshold';
  return buildRiskControlExpandedCurrencyValueEntries(
    detail.currencyConditions,
    translate,
    thresholdLabelKey,
  );
}

function buildOutflowTriggerItems(
  detail: ReturnType<typeof resolveRiskControlAutoRuleRecordDetail>,
  translate: (key: string) => string,
): DetailItemData[] {
  const walletOrProjectTitle = detail.withdrawalTypeKey === 'API Payout'
    ? translate('WaaS Project')
    : translate('Wallet');

  const items: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-withdrawal-type',
        title: translate('Withdrawal Type'),
        value: translate(detail.withdrawalTypeKey ?? 'Manual Transfer'),
      }),
      titleIcon: 'eds-business-type',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-outflow-scope-target',
        title: walletOrProjectTitle,
        value: detail.waasProject,
      }),
      titleIcon: detail.withdrawalTypeKey === 'API Payout' ? 'eds-floder-favorite' : 'eds-wallet',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-skip-whitelist',
        title: translate('Skip addresses in whitelist'),
        value: detail.skipWhitelistEnabled ? translate('Enable') : translate('Disabled'),
      }),
      titleIcon: 'eds-white-list',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-skip-internal',
        title: translate('Skip internal team addresses'),
        value: detail.skipInternalTeamEnabled ? translate('Enable') : translate('Disabled'),
      }),
      titleIcon: 'eds-associates',
    },
  ];

  const currencyItem = buildRiskControlCurrencyConditionsItem({
    itemKey: AUTO_RULE_CURRENCIES_ITEM_KEY,
    title: translate('Currency'),
    conditions: detail.currencyConditions,
    hiddenCount: detail.hiddenCurrencyConditionCount,
    translate,
    thresholdLabelKey: 'Auto rule per payout amount threshold',
  });
  if (currencyItem) items.push(currencyItem);

  items.push(
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-service-provider',
        title: translate('Service Provider'),
        value: detail.serviceProvider,
      }),
      titleIcon: 'eds-circle-pentagram',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-screening-node',
        title: translate('Screening Node'),
        value: translate(detail.screeningNodeKey ?? 'Before approval process'),
      }),
      titleIcon: 'eds-hierarchy',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-risk-rating-criteria',
        title: translate('Risk Rating Criteria'),
        value: detail.riskRatingCriteria,
      }),
      titleIcon: 'eds-triangle-flag',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-risk-control-action',
        title: translate('Risk control action'),
        value: translate(detail.riskControlActionKey ?? 'Alarm the reviewer(s)/signer(s)'),
      }),
      titleIcon: 'eds-aml-warning',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-exception-handling',
        title: translate('Screening Exception handling'),
        value: translate(detail.exceptionHandlingKey ?? 'Skip the query'),
      }),
      titleIcon: 'eds-abnormal-orders',
    },
  );

  const alertRecipientParts: string[] = [];
  const alertKeys = detail.riskAlertRecipientKeys ?? [];
  if (alertKeys.includes('In-app notification')) {
    const names = (detail.riskAlertInAppRecipientIds ?? [])
      .map((id) => autoRuleTeamMemberById(id)?.name ?? id)
      .join(', ');
    alertRecipientParts.push(
      names
        ? `${translate('In-app notification')}: ${names}`
        : translate('In-app notification'),
    );
  }
  if (alertKeys.includes('Email notification')) {
    const teamNames = (detail.riskAlertEmailTeamMemberIds ?? [])
      .map((id) => autoRuleTeamMemberById(id)?.name ?? id)
      .join(', ');
    alertRecipientParts.push(
      teamNames
        ? `${translate('Email notification')}: ${teamNames}`
        : translate('Email notification'),
    );
  }
  const alertRecipientValue = alertRecipientParts.join(' · ');
  items.push({
    ...createDetailApplyItemRow('text', {
      key: AUTO_RULE_ALERT_RECIPIENT_ITEM_KEY,
      title: translate('Risk Alert Recipient'),
      value: alertRecipientValue,
    }),
    titleIcon: 'eds-user-notification',
  });

  return items;
}

export function buildRiskControlAutoRuleDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolveRiskControlAutoRuleRecordDetail(row);
  const currencyItem = buildRiskControlCurrencyConditionsItem({
    itemKey: AUTO_RULE_CURRENCIES_ITEM_KEY,
    title: translate('Currency'),
    conditions: detail.currencyConditions,
    hiddenCount: detail.hiddenCurrencyConditionCount,
    translate,
  });

  const overviewItems: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('brand-number', {
        key: 'auto-rule-record-number',
        title: translate('Rule Number'),
        value: detail.recordNumber,
      }),
      titleIcon: 'eds-brand-numbers',
    },
    createDetailApplyItemRow('initiated-by', {
      key: AUTO_RULE_CREATOR_ITEM_KEY,
      title: translate('Creator'),
      value: detail.creatorName,
      valueSymbolAvatarName: detail.creatorAvatarName,
      valueSecondary: detail.creatorEmailMasked,
    }),
    createDetailApplyItemRow('time', {
      key: 'auto-rule-created-at',
      title: translate('Creation Time'),
      value: detail.createdAt,
    }),
  ];

  const triggerItems: DetailItemData[] = detail.direction === 'outflow'
    ? buildOutflowTriggerItems(detail, translate)
    : (() => {
      const inflowItems: DetailItemData[] = [
        {
          ...createDetailApplyItemRow('text', {
            key: 'auto-rule-waas-project',
            title: translate('WaaS Project'),
            value: detail.waasProject,
          }),
          titleIcon: 'eds-floder-favorite',
        },
        {
          ...createDetailApplyItemRow('text', {
            key: 'auto-rule-service-provider',
            title: translate('Service Provider'),
            value: detail.serviceProvider,
          }),
          titleIcon: 'eds-circle-pentagram',
        },
      ];
      if (currencyItem) inflowItems.push(currencyItem);
      inflowItems.push(
        {
          ...createDetailApplyItemRow('text', {
            key: 'auto-rule-risk-rating-criteria',
            title: translate('Risk Rating Criteria'),
            value: detail.riskRatingCriteria,
          }),
          titleIcon: 'eds-triangle-flag',
        },
        {
          ...createDetailApplyItemRow('initiated-by', {
            key: AUTO_RULE_ALERT_RECIPIENT_ITEM_KEY,
            title: translate('Risk Alert Recipient'),
            value: detail.alertRecipientName,
            valueSymbolAvatarName: detail.alertRecipientAvatarName,
            valueSecondary: detail.alertRecipientEmailMasked,
          }),
          titleIcon: 'eds-user-notification',
        },
      );
      return inflowItems;
    })();

  return [
    {
      key: 'auto-rule-overview',
      items: overviewItems,
      showDivider: true,
    },
    {
      key: 'auto-rule-trigger-rules',
      title: translate('Auto rule trigger condition'),
      items: triggerItems,
    },
  ];
}
