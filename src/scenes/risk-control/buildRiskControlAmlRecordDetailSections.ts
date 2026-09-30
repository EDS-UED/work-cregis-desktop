import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveRiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';

export const AML_QUERY_RESULT_RISK_RATING_ITEM_KEY = 'aml-query-result-risk-rating';
export const AML_QUERY_RESULT_ENTITY_TAGS_ITEM_KEY = 'aml-query-result-entity-tags';
export const AML_QUERY_DETAIL_REQUESTER_ITEM_KEY = 'aml-query-detail-requester';
export const AML_QUERY_DETAIL_NETWORK_ITEM_KEY = 'aml-query-detail-network';

export type RiskControlAmlRecordDetailTabKind =
  | 'queryResult'
  | 'triggerRules'
  | 'riskTrace'
  | 'queryDetail';

export const RISK_CONTROL_AML_RECORD_DETAIL_TAB_KINDS: readonly RiskControlAmlRecordDetailTabKind[] = [
  'queryResult',
  'triggerRules',
  'riskTrace',
  'queryDetail',
];

export function resolveRiskControlAmlRecordDetailTabKinds(): RiskControlAmlRecordDetailTabKind[] {
  return [...RISK_CONTROL_AML_RECORD_DETAIL_TAB_KINDS];
}

export function resolveRiskControlAmlRecordDetailTabLabels(
  translate: (key: string) => string,
): string[] {
  return resolveRiskControlAmlRecordDetailTabKinds().map((kind) => {
    if (kind === 'queryResult') return translate('Query Results');
    if (kind === 'triggerRules') return translate('Trigger Rules');
    if (kind === 'riskTrace') return translate('Risk Traceability');
    return translate('Query Details');
  });
}

function buildQueryResultTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row);

  return [
    {
      ...createDetailApplyItemRow('status', {
        key: AML_QUERY_RESULT_RISK_RATING_ITEM_KEY,
        title: translate('Risk Rating'),
        tag: translate(detail.riskLabelKey),
      }),
      titleIcon: 'eds-triangle-flag',
      valueTagOnly: true,
      value: '',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-query-result-service-provider',
        title: translate('Service Provider'),
        value: detail.serviceProvider,
      }),
      titleIcon: 'eds-circle-pentagram',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-query-result-belonging-entity',
        title: translate('Belonging Entity'),
        value: detail.belongingEntity,
      }),
      titleIcon: 'eds-briefcase',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: AML_QUERY_RESULT_ENTITY_TAGS_ITEM_KEY,
        title: translate('Entity Tags'),
        value: ' ',
      }),
      titleIcon: 'eds-magic-tag',
      valueTagOnly: true,
      value: '',
    },
  ];
}

function buildTriggerRulesTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row);

  return [
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-trigger-waas-project',
        title: translate('WaaS Project'),
        value: detail.waasProject,
      }),
      titleIcon: 'eds-floder-favorite',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-trigger-rule-name',
        title: translate('Rule Name'),
        value: detail.ruleName,
      }),
      titleIcon: 'eds-enterprise-name',
    },
    createDetailApplyItemRow('brand-number', {
      key: 'aml-trigger-rule-number',
      title: translate('Rule Number'),
      value: detail.ruleNumber,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-trigger-service-provider',
        title: translate('Service Provider'),
        value: detail.serviceProvider,
      }),
      titleIcon: 'eds-circle-pentagram',
    },
  ];
}

function buildQueryDetailTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row);

  return [
    {
      ...createDetailApplyItemRow('receiver', {
        key: 'aml-query-detail-address',
        title: translate('Address'),
        value: detail.targetValue,
        tag: detail.networkLabel,
      }),
      titleIcon: 'eds-blockchain-address',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: AML_QUERY_DETAIL_NETWORK_ITEM_KEY,
        title: translate('Query Network'),
        value: detail.networkLabel,
        valueSymbolCrypto: detail.networkCryptoName,
        valueIcon: detail.networkCryptoName,
      }),
      titleIcon: 'eds-blockchain',
      showValueSymbol: true,
      valueSymbolKind: 'crypto',
    },
    createDetailApplyItemRow('initiated-by', {
      key: AML_QUERY_DETAIL_REQUESTER_ITEM_KEY,
      title: translate('Requester'),
      value: detail.requesterName,
      valueSymbolAvatarName: detail.requesterAvatarName,
      valueSecondary: detail.requesterEmailMasked,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-query-detail-object',
        title: translate('Query Object'),
        value: translate(detail.queryObjectKey),
      }),
      titleIcon: 'eds-query-object',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-query-detail-type',
        title: translate('Type'),
        value: translate(detail.triggerModeKey),
      }),
      titleIcon: 'eds-business-type',
    },
    createDetailApplyItemRow('time', {
      key: 'aml-query-detail-time',
      title: translate('Query Time'),
      value: detail.queryTime,
    }),
  ];
}

export function buildRiskControlAmlRecordDetailSections(
  row: PaymentEngineRecordRow,
  activeTab: number,
  translate: (key: string) => string,
): DetailSectionData[] {
  const tabKind = resolveRiskControlAmlRecordDetailTabKinds()[activeTab] ?? 'queryResult';

  if (tabKind === 'riskTrace') {
    return [];
  }

  if (tabKind === 'triggerRules') {
    return [{
      key: 'aml-trigger-rules',
      items: buildTriggerRulesTabItems(row, translate),
    }];
  }

  if (tabKind === 'queryDetail') {
    return [{
      key: 'aml-query-details',
      items: buildQueryDetailTabItems(row, translate),
    }];
  }

  return [{
    key: 'aml-query-results',
    items: buildQueryResultTabItems(row, translate),
  }];
}
