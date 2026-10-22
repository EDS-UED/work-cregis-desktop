import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveRiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';

export const AML_QUERY_DETAIL_ADDRESS_ITEM_KEY = 'aml-query-detail-address';
export const AML_QUERY_DETAIL_REQUESTER_ITEM_KEY = 'aml-query-detail-requester';
export const AML_QUERY_DETAIL_NETWORK_ITEM_KEY = 'aml-query-detail-network';
export const AML_QUERY_DETAIL_COLLABORATION_ITEM_KEY = 'aml-query-detail-collaboration';
export const AML_QUERY_DETAIL_SENDER_ITEM_KEY = 'aml-query-detail-sender';
export const AML_QUERY_DETAIL_AMOUNT_ITEM_KEY = 'aml-query-detail-amount';
export const AML_QUERY_DETAIL_CONTROL_MEASURE_ITEM_KEY = 'aml-query-detail-control-measure';

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

export function resolveRiskControlAmlRecordDetailTabKinds(
  row?: PaymentEngineRecordRow,
): RiskControlAmlRecordDetailTabKind[] {
  if (row?.amlQueryException) {
    return RISK_CONTROL_AML_RECORD_DETAIL_TAB_KINDS.filter((kind) => kind !== 'riskTrace');
  }
  return [...RISK_CONTROL_AML_RECORD_DETAIL_TAB_KINDS];
}

export function resolveRiskControlAmlRecordDetailTabLabels(
  translate: (key: string) => string,
  row?: PaymentEngineRecordRow,
): string[] {
  return resolveRiskControlAmlRecordDetailTabKinds(row).map((kind) => {
    if (kind === 'queryResult') return translate('Query Results');
    if (kind === 'triggerRules') return translate('Trigger Rules');
    if (kind === 'riskTrace') return translate('Risk Traceability');
    return translate('Query Details');
  });
}

function buildTriggerRulesTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row, translate);

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
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-trigger-risk-threshold',
        title: translate('Risk score threshold'),
        value: String(detail.riskThreshold),
      }),
      titleIcon: 'eds-aml-search',
    },
  ];
}

function resolveControlMeasureLabel(
  detail: ReturnType<typeof resolveRiskControlAmlQueryRecordDetail>,
  translate: (key: string) => string,
): string {
  if (detail.controlMeasureKey === 'none') return '--';
  if (detail.controlMeasureKey === 'rejected') return translate('Rejected');
  return translate('Alerted');
}

function buildAmlQueryRequesterItem(
  detail: ReturnType<typeof resolveRiskControlAmlQueryRecordDetail>,
  translate: (key: string) => string,
  isOutflowAuto: boolean,
): DetailItemData {
  if (isOutflowAuto) {
    return {
      ...createDetailApplyItemRow('text', {
        key: AML_QUERY_DETAIL_REQUESTER_ITEM_KEY,
        title: translate('Requester'),
        value: detail.requesterName,
      }),
      titleIcon: 'eds-arrow-launch-circle',
    };
  }
  return createDetailApplyItemRow('initiated-by', {
    key: AML_QUERY_DETAIL_REQUESTER_ITEM_KEY,
    title: translate('Requester'),
    value: detail.requesterName,
    valueSymbolAvatarName: detail.requesterAvatarName,
    valueSecondary: detail.requesterEmailMasked,
  });
}

function buildQueryDetailTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row, translate);
  const isOutflowAuto = detail.isOutflowAutoQuery || detail.isQueryException;

  if (isOutflowAuto) {
    return [
      buildAmlQueryRequesterItem(detail, translate, true),
      createDetailApplyItemRow('brand-number', {
        key: AML_QUERY_DETAIL_COLLABORATION_ITEM_KEY,
        title: translate('Collaboration number'),
        value: detail.collaborationNumber,
      }),
      createDetailApplyItemRow('receiver', {
        key: AML_QUERY_DETAIL_ADDRESS_ITEM_KEY,
        title: translate('Receiver address'),
        value: detail.targetValue,
        tag: '',
      }),
      createDetailApplyItemRow('sender', {
        key: AML_QUERY_DETAIL_SENDER_ITEM_KEY,
        title: translate('Sender address'),
        value: detail.senderAddress,
        tag: '',
      }),
      {
        ...createDetailApplyItemRow('amount', {
          key: AML_QUERY_DETAIL_AMOUNT_ITEM_KEY,
          title: translate('Transaction application amount'),
          value: `${detail.transactionAmount} ${detail.transactionSymbol}`,
        }),
        titleIcon: 'eds-circle-pentagram',
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
      createDetailApplyItemRow('time', {
        key: 'aml-query-detail-time',
        title: translate('Query Time'),
        value: detail.queryTime,
      }),
      {
        ...createDetailApplyItemRow('text', {
          key: AML_QUERY_DETAIL_CONTROL_MEASURE_ITEM_KEY,
          title: translate('Risk control measure'),
          value: resolveControlMeasureLabel(detail, translate),
        }),
        titleIcon: 'eds-aml-warning',
      },
    ];
  }

  return [
    createDetailApplyItemRow('receiver', {
      key: AML_QUERY_DETAIL_ADDRESS_ITEM_KEY,
      title: translate('Address'),
      value: detail.targetValue,
      tag: '',
    }),
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
    buildAmlQueryRequesterItem(detail, translate, false),
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-query-detail-object',
        title: translate('Query Object'),
        value: translate(detail.queryObjectKey),
      }),
      titleIcon: 'eds-text-note',
    },
    {
      ...createDetailApplyItemRow('status', {
        key: 'aml-query-detail-type',
        title: translate('Type'),
        tag: translate(detail.triggerModeKey),
      }),
      titleIcon: 'eds-business-type',
      tagFamily: 'system',
      tagSystemType: 'gray',
      valueTagOnly: true,
      value: '',
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
  const tabKind = resolveRiskControlAmlRecordDetailTabKinds(row)[activeTab] ?? 'queryResult';

  if (tabKind === 'riskTrace' || tabKind === 'queryResult') {
    return [];
  }

  if (tabKind === 'triggerRules') {
    return [{
      key: 'aml-trigger-rules',
      items: buildTriggerRulesTabItems(row, translate),
    }];
  }

  return [{
    key: 'aml-query-details',
    items: buildQueryDetailTabItems(row, translate),
  }];
}
