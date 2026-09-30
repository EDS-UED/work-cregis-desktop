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

  const triggerItems: DetailItemData[] = [
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

  if (currencyItem) {
    triggerItems.push(currencyItem);
  }

  triggerItems.push(
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
