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
  return buildRiskControlExpandedCurrencyValueEntries(
    detail.currencyConditions,
    translate,
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
    createDetailApplyItemRow('text', {
      key: 'auto-rule-withdrawal-type',
      title: translate('Withdrawal Type'),
      value: translate(detail.withdrawalTypeKey ?? 'Manual Transfer'),
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-outflow-scope-target',
        title: walletOrProjectTitle,
        value: detail.waasProject,
      }),
      titleIcon: detail.withdrawalTypeKey === 'API Payout' ? 'eds-floder-favorite' : 'eds-wallet',
    },
    createDetailApplyItemRow('text', {
      key: 'auto-rule-skip-whitelist',
      title: translate('Skip addresses in whitelist'),
      value: detail.skipWhitelistEnabled ? translate('Enable') : translate('Disabled'),
    }),
    createDetailApplyItemRow('text', {
      key: 'auto-rule-skip-internal',
      title: translate('Skip internal team addresses'),
      value: detail.skipInternalTeamEnabled ? translate('Enable') : translate('Disabled'),
    }),
  ];

  const currencyItem = buildRiskControlCurrencyConditionsItem({
    itemKey: AUTO_RULE_CURRENCIES_ITEM_KEY,
    title: translate('Currency'),
    conditions: detail.currencyConditions,
    hiddenCount: detail.hiddenCurrencyConditionCount,
    translate,
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
    createDetailApplyItemRow('text', {
      key: 'auto-rule-screening-node',
      title: translate('Screening Node'),
      value: translate(detail.screeningNodeKey ?? 'Before approval process'),
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'auto-rule-risk-rating-criteria',
        title: translate('Risk Rating Criteria'),
        value: detail.riskRatingCriteria,
      }),
      titleIcon: 'eds-triangle-flag',
    },
    createDetailApplyItemRow('text', {
      key: 'auto-rule-risk-control-action',
      title: translate('Risk control action'),
      value: translate(detail.riskControlActionKey ?? 'Alarm the reviewer(s)/signer(s)'),
    }),
    createDetailApplyItemRow('text', {
      key: 'auto-rule-exception-handling',
      title: translate('Screening Exception handling'),
      value: translate(detail.exceptionHandlingKey ?? 'Bypass the query, proceed and notify the operator'),
    }),
  );

  if (detail.exceptionHandlerName) {
    items.push({
      ...createDetailApplyItemRow('initiated-by', {
        key: 'auto-rule-exception-handler',
        title: translate('Handler'),
        value: detail.exceptionHandlerName,
        valueSymbolAvatarName: detail.exceptionHandlerAvatarName,
      }),
      titleIcon: 'eds-user-notification',
    });
  }

  items.push({
    ...createDetailApplyItemRow('text', {
      key: AUTO_RULE_ALERT_RECIPIENT_ITEM_KEY,
      title: translate('Risk Alert Recipient'),
      value: translate('Withdrawal initiator'),
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
    createDetailApplyItemRow('brand-number', {
      key: 'auto-rule-record-number',
      title: translate('Number'),
      value: detail.recordNumber,
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
      title: translate('Trigger Rules'),
      items: triggerItems,
    },
  ];
}
