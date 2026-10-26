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
export const AML_QUERY_DETAIL_SERVICE_PROVIDER_ITEM_KEY = 'aml-query-detail-service-provider';

export type RiskControlAmlRecordDetailTabKind =
  | 'queryResult'
  | 'riskTrace'
  | 'queryDetail';

export const RISK_CONTROL_AML_RECORD_DETAIL_TAB_KINDS: readonly RiskControlAmlRecordDetailTabKind[] = [
  'queryResult',
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
    if (kind === 'queryResult') return translate('AML risk profile title');
    if (kind === 'riskTrace') return translate('AML counterparty risk title');
    return translate('AML audit log title');
  });
}

function buildReviewLogTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolveRiskControlAmlQueryRecordDetail(row, translate);
  const review = detail.reviewLog;

  return [
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-review-risk-before',
        title: translate('Status before Review'),
        value: translate(review.riskLevelBeforeKey),
      }),
      titleIcon: 'eds-aml-warning',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-review-risk-after',
        title: translate('Status After Review'),
        value: translate(review.riskLevelAfterKey),
      }),
      titleIcon: 'eds-aml-warning',
    },
    {
      ...createDetailApplyItemRow('initiated-by', {
        key: 'aml-review-reviewer',
        title: translate('AML reviewer'),
        value: review.reviewerName,
        valueSymbolAvatarName: review.reviewerAvatarName,
      }),
      titleIcon: 'eds-user-pointer',
    },
    createDetailApplyItemRow('time', {
      key: 'aml-review-time',
      title: translate('AML review time'),
      value: review.reviewedAt,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'aml-review-remark',
        title: translate('Note'),
        value: review.remark,
      }),
      titleIcon: 'eds-text-note',
    },
  ];
}

function buildAmlQueryServiceProviderItem(
  detail: ReturnType<typeof resolveRiskControlAmlQueryRecordDetail>,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('text', {
      key: AML_QUERY_DETAIL_SERVICE_PROVIDER_ITEM_KEY,
      title: translate('Service Provider'),
      value: detail.serviceProvider,
    }),
    titleIcon: 'eds-circle-pentagram',
  };
}

function buildAmlQueryAddressApplyItem(
  variant: 'receiver' | 'sender',
  options: {
    key: string;
    title: string;
    value: string;
    networkLabel: string;
  },
): DetailItemData {
  const networkTag = options.networkLabel.trim();
  return {
    ...createDetailApplyItemRow(variant, {
      key: options.key,
      title: options.title,
      value: options.value,
      tag: networkTag,
    }),
    ...(networkTag
      ? {
          tagBeforeValue: false,
          tagFamily: 'system' as const,
          tagSystemType: 'stroke-subtle' as const,
        }
      : {}),
  };
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
        title: translate('Query Initiator'),
        value: detail.requesterName,
      }),
      titleIcon: 'eds-user-searches',
    };
  }
  return createDetailApplyItemRow('initiated-by', {
    key: AML_QUERY_DETAIL_REQUESTER_ITEM_KEY,
    title: translate('Query Initiator'),
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
      buildAmlQueryServiceProviderItem(detail, translate),
      {
        ...createDetailApplyItemRow('brand-number', {
          key: AML_QUERY_DETAIL_COLLABORATION_ITEM_KEY,
          title: translate('Collaboration number'),
          value: detail.collaborationNumber,
        }),
        titleIcon: 'eds-steps-number',
      },
      buildAmlQueryAddressApplyItem('receiver', {
        key: AML_QUERY_DETAIL_ADDRESS_ITEM_KEY,
        title: translate('Receiver address'),
        value: detail.targetValue,
        networkLabel: detail.networkLabel,
      }),
      buildAmlQueryAddressApplyItem('sender', {
        key: AML_QUERY_DETAIL_SENDER_ITEM_KEY,
        title: translate('Sender address'),
        value: detail.senderAddress,
        networkLabel: detail.networkLabel,
      }),
      createDetailApplyItemRow('amount', {
        key: AML_QUERY_DETAIL_AMOUNT_ITEM_KEY,
        title: translate('Transaction application amount'),
        value: `${detail.transactionAmount} ${detail.transactionSymbol}`,
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
    buildAmlQueryAddressApplyItem('receiver', {
      key: AML_QUERY_DETAIL_ADDRESS_ITEM_KEY,
      title: translate('Address'),
      value: detail.targetValue,
      networkLabel: detail.networkLabel,
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
    buildAmlQueryServiceProviderItem(detail, translate),
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

  return [
    {
      key: 'aml-query-log',
      title: translate('AML query log section title'),
      showDivider: true,
      items: buildQueryDetailTabItems(row, translate),
    },
    {
      key: 'aml-review-log',
      title: translate('AML review log section title'),
      items: buildReviewLogTabItems(row, translate),
    },
  ];
}
