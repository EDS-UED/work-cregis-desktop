import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import { resolveCallbackEventLabelKey } from './paymentEngineListFieldCustomize';
import {
  isCallbackErrorRecordMenuItem,
  isCallbackRecordDetailMenuItem,
  isHistoryCallbackRecordMenuItem,
} from './paymentEngineOrderRecordData';
import {
  isOrderModeCallbackExperience,
  type PaymentEngineCallbackExperience,
} from './paymentEngineCallbackExperience';
import { resolvePaymentCallbackErrorRecordDetail } from './paymentEngineCallbackErrorDetailData';
import type {
  PaymentEngineOrderStatus,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import {
  resolvePaymentEngineRecordStatusDetailLabel,
  resolvePaymentEngineRecordStatusDetailTagStatus,
} from './paymentEngineRecordStatusCustomize';
import {
  resolvePaymentEngineOrderStatusLabelKey,
  resolvePaymentEngineOrderStatusTagVariant,
} from './paymentEngineOrderStatusLabels';
import { createPaymentEngineTransferBlockTimeRow } from './paymentEngineDetailApplyItemRows';

export type PaymentEngineCallbackErrorDetailTabKind = 'callback' | 'related';

export function resolvePaymentEngineCallbackErrorDetailTabKinds(
  row: PaymentEngineRecordRow,
): PaymentEngineCallbackErrorDetailTabKind[] {
  return ['callback', 'related'];
}

export function resolvePaymentEngineCallbackErrorDetailTabLabels(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): string[] {
  const secondTabLabel = row.callbackEventType === 'wallet-payout'
    ? translate('Wallet Payout')
    : translate('Payment Related');

  return [translate('Callback Tab'), secondTabLabel];
}

function buildOrderStatusDetailItem(
  titleKey: string,
  itemKey: string,
  status: PaymentEngineOrderStatus,
  translate: (key: string) => string,
  overrides?: {
    labelKey?: string;
    tagStatus?: TagStatus;
  },
): DetailItemData {
  const label = translate(overrides?.labelKey ?? resolvePaymentEngineOrderStatusLabelKey(status));
  const variant = resolvePaymentEngineOrderStatusTagVariant(status);

  const tagStatus: TagStatus = overrides?.tagStatus
    ?? (status === 'additional-payment-required'
      ? 'warning'
      : status === 'pending'
        ? 'warning'
        : variant.kind === 'status'
          ? variant.status
          : 'success');

  return {
    ...createDetailApplyItemRow('status', {
      key: itemKey,
      title: translate(titleKey),
      tag: label,
    }),
    tagFamily: 'status',
    tagStatus,
    valueTagOnly: true,
    value: '',
  };
}

function buildTransStatusDetailItem(
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('status', {
      key: 'callback-wallet-trans-status',
      title: translate('Trans Status'),
      tag: translate('Success'),
    }),
    tagFamily: 'status',
    tagStatus: 'success',
    valueTagOnly: true,
    value: '',
  };
}

/** 异常回调详情 Headline 旁交易状态 Tag（原详情「交易状态」行）。 */
export function resolvePaymentEngineCallbackErrorHeadlineStatus(
  _row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): { label: string; status: TagStatus } {
  return {
    label: translate('Success'),
    status: 'success',
  };
}

function buildCallbackRecordStatusItem(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData {
  const label = resolvePaymentEngineRecordStatusDetailLabel(row, menuItem, translate);

  return {
    ...createDetailApplyItemRow('status', {
      key: 'callback-record-status',
      title: translate('Status'),
      tag: label,
    }),
    tagFamily: 'status',
    tagStatus: resolvePaymentEngineRecordStatusDetailTagStatus(row, menuItem),
    valueTagOnly: true,
    value: '',
  };
}

function buildPushMethodItem(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  const isManual = row.callbackTriggerMode === 'manual';

  return {
    ...createDetailApplyItemRow('status', {
      key: 'callback-push-method',
      title: translate('Push Method'),
      tag: translate(isManual ? 'Manual' : 'Auto'),
    }),
    titleIcon: 'eds-arrow-export',
    tagFamily: 'system',
    tagSystemType: 'gray',
    valueTagOnly: true,
    value: '',
  };
}

function buildPushStatusItem(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData {
  const label = resolvePaymentEngineRecordStatusDetailLabel(row, menuItem, translate);

  return {
    ...createDetailApplyItemRow('status', {
      key: 'history-callback-push-status',
      title: translate('Push Status'),
      tag: label,
    }),
    tagFamily: 'status',
    tagStatus: resolvePaymentEngineRecordStatusDetailTagStatus(row, menuItem),
    valueTagOnly: true,
    value: '',
  };
}

function buildHistoryCallbackDetailItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);
  const businessTypeKey = row.businessTypeKey ?? detail.businessTypeKey ?? 'Withdrawal';

  return [
    createDetailApplyItemRow('type', {
      key: 'history-callback-business-type',
      title: translate('Business Type'),
      value: translate(businessTypeKey),
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'history-callback-wallet',
        title: translate('Wallet'),
        value: formatEmptyDisplayValue(detail.walletType),
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'history-callback-sender',
      title: translate('Sender'),
      value: detail.senderAddress ?? '',
      tag: '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'history-callback-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress ?? '',
      tag: detail.receiverAlias ?? '',
    }),
    buildPushMethodItem(row, translate),
    buildPushStatusItem(row, menuItem, translate),
    createDetailApplyItemRow('tripartite-number', {
      key: 'history-callback-third-party-business-no',
      title: translate('Third-party Reference'),
      value: detail.thirdPartyBusinessNo ?? '',
    }),
    createPaymentEngineTransferBlockTimeRow({
      key: 'history-callback-update-time',
      title: translate('Update Time'),
      value: detail.updateTime,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'history-callback-callback-address',
        title: translate('Callback URL'),
        value: detail.callbackUrl,
      }),
      titleIcon: 'eds-link',
    },
    createDetailApplyItemRow('txid', {
      key: 'history-callback-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash ?? '',
    }),
    createDetailApplyItemRow('remark', {
      key: 'history-callback-remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(detail.remark),
    }),
    createDetailApplyItemRow('memo', {
      key: 'history-callback-memo',
      title: translate('Memo'),
      value: formatEmptyDisplayValue(detail.memo),
    }),
  ];
}

function buildCallbackErrorDetailItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);

  return [
    createDetailApplyItemRow('type', {
      key: 'callback-error-business-type',
      title: translate('Business Type'),
      value: translate(detail.businessTypeKey ?? 'Withdrawal'),
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-error-wallet',
        title: translate('Wallet'),
        value: formatEmptyDisplayValue(detail.walletType),
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'callback-error-sender',
      title: translate('Sender'),
      value: detail.senderAddress ?? '',
      tag: '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'callback-error-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress ?? '',
      tag: detail.receiverAlias ?? '',
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'callback-error-third-party-business-no',
      title: translate('Third-party Reference'),
      value: detail.thirdPartyBusinessNo ?? '',
    }),
    createPaymentEngineTransferBlockTimeRow({
      key: 'callback-error-update-time',
      title: translate('Update Time'),
      value: detail.updateTime,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-error-callback-address',
        title: translate('Callback URL'),
        value: detail.callbackUrl,
      }),
      titleIcon: 'eds-link',
    },
    createDetailApplyItemRow('txid', {
      key: 'callback-error-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash ?? '',
    }),
    createDetailApplyItemRow('remark', {
      key: 'callback-error-remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(detail.remark),
    }),
    createDetailApplyItemRow('memo', {
      key: 'callback-error-memo',
      title: translate('Memo'),
      value: formatEmptyDisplayValue(detail.memo),
    }),
    createDetailApplyItemRow('reason', {
      key: 'callback-error-failure-reason',
      title: translate('Failure Reason'),
      value: formatEmptyDisplayValue(detail.abnormalReason),
    }),
  ];
}

function buildOrderModeCallbackTabItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);
  const isHistoryCallback = isHistoryCallbackRecordMenuItem(menuItem);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'callback-record-id',
      title: translate('Callback Record ID'),
      value: detail.callbackRecordId,
    }),
    {
      ...createDetailApplyItemRow('time', {
        key: 'callback-callback-time',
        title: translate('Callback Time'),
        value: detail.updateTime,
      }),
      titleIcon: 'eds-calendar',
    },
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-callback-address',
        title: translate('Callback URL'),
        value: detail.callbackUrl,
      }),
      titleIcon: 'eds-link',
    },
  ];

  if (isHistoryCallback) {
    items.push(buildPushMethodItem(row, translate));
    return items;
  }

  items.push(createDetailApplyItemRow('reason', {
    key: 'callback-failure-reason',
    title: translate('Failure Reason'),
    value: formatEmptyDisplayValue(detail.abnormalReason),
  }));

  return items;
}

function buildCallbackTabItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);
  const isHistoryCallback = isHistoryCallbackRecordMenuItem(menuItem);
  const isCallbackError = isCallbackErrorRecordMenuItem(menuItem);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: isCallbackError ? 'callback-event-id' : 'callback-record-id',
      title: translate(isCallbackError ? 'Callback Event ID' : 'ID'),
      value: isCallbackError
        ? (row.callbackEventId ?? '')
        : detail.callbackRecordId,
    }),
  ];

  if (isHistoryCallback) {
    if (row.callbackStatus) {
      items.push(buildCallbackRecordStatusItem(row, menuItem, translate));
    }
    items.push(buildPushMethodItem(row, translate));
  }

  items.push(
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-url',
        title: translate('Callback URL'),
        value: detail.callbackUrl,
      }),
      titleIcon: 'eds-link',
    },
    createPaymentEngineTransferBlockTimeRow({
      key: 'callback-update-time',
      title: translate('Update Time'),
      value: detail.updateTime,
    }),
  );

  if (isCallbackError && detail.abnormalReason) {
    items.push(createDetailApplyItemRow('reason', {
      key: 'callback-abnormal-reason',
      title: translate('Abnormal Reason'),
      value: detail.abnormalReason,
    }));
  }

  if (isHistoryCallback && detail.filteredReasonKey) {
    items.push(createDetailApplyItemRow('reason', {
      key: 'callback-filtered-reason',
      title: translate('Filtered Reason'),
      value: translate(detail.filteredReasonKey),
    }));
  }

  return items;
}

function buildPaymentRelatedTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);
  const eventLabelKey = resolveCallbackEventLabelKey(row.callbackEventType);

  const merchantOrderId = row.callbackEventType === 'payment-exception'
    ? '-'
    : (detail.merchantOrderId ?? '');

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'callback-order-id',
      title: translate('Order ID'),
      value: row.callbackEventId ?? detail.orderId,
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'callback-merchant-order-id',
      title: translate('Merchant Order ID'),
      value: merchantOrderId,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-event-type',
        title: translate('Callback Event'),
        value: translate(eventLabelKey),
      }),
      titleIcon: 'eds-business-type',
    },
    buildOrderStatusDetailItem(
      'Callback Event Status',
      'callback-event-status',
      detail.callbackEventStatus,
      translate,
      {
        labelKey: detail.callbackEventStatusLabelKey,
        tagStatus: detail.callbackEventStatusTagStatus,
      },
    ),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'callback-related-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  return items;
}

function buildWalletPayoutRelatedTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('type', {
      key: 'callback-wallet-payout-callback',
      title: translate('Callback Tab'),
      value: translate('Wallet Payout'),
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'callback-wallet-type',
        title: translate('Wallet'),
        value: formatEmptyDisplayValue(detail.walletType),
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('brand-number', {
      key: 'callback-payout-id',
      title: translate('Payout ID'),
      value: detail.payoutId ?? '',
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'callback-third-party-business-no',
      title: translate('Third Party Business No.'),
      value: detail.thirdPartyBusinessNo ?? '',
    }),
    buildTransStatusDetailItem(translate),
    createDetailApplyItemRow('sender', {
      key: 'callback-wallet-sender',
      title: translate('Sender'),
      value: detail.senderAddress ?? '',
      tag: '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'callback-wallet-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress ?? '',
      tag: detail.receiverAlias ?? '',
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'callback-wallet-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.remark?.trim()) {
    items.push(createDetailApplyItemRow('memo', {
      key: 'callback-wallet-remark',
      title: translate('Remark'),
      value: detail.remark,
    }));
  }

  return items;
}

export function buildPaymentEngineCallbackErrorDetailSections(
  row: PaymentEngineRecordRow,
  activeTab: number,
  translate: (key: string) => string,
  menuItem = 'Callback Error',
  experience: PaymentEngineCallbackExperience = 'standard',
): DetailSectionData[] {
  const useOrderModeTabs =
    isOrderModeCallbackExperience(experience)
    && isCallbackRecordDetailMenuItem(menuItem);

  if (!useOrderModeTabs && isCallbackErrorRecordMenuItem(menuItem)) {
    return [{
      key: 'callback-error-detail',
      showDivider: false,
      items: buildCallbackErrorDetailItems(row, translate),
    }];
  }

  if (!useOrderModeTabs && isHistoryCallbackRecordMenuItem(menuItem)) {
    return [{
      key: 'history-callback-detail',
      showDivider: false,
      items: buildHistoryCallbackDetailItems(row, menuItem, translate),
    }];
  }

  const tabKind = resolvePaymentEngineCallbackErrorDetailTabKinds(row)[activeTab] ?? 'callback';
  const sectionKeyPrefix = isHistoryCallbackRecordMenuItem(menuItem)
    ? 'history-callback'
    : 'callback-error';

  if (tabKind === 'callback') {
    const items = useOrderModeTabs
      ? buildOrderModeCallbackTabItems(row, menuItem, translate)
      : buildCallbackTabItems(row, menuItem, translate);
    return [{
      key: `${sectionKeyPrefix}-callback-tab`,
      items,
    }];
  }

  const relatedItems = row.callbackEventType === 'wallet-payout'
    ? buildWalletPayoutRelatedTabItems(row, translate)
    : buildPaymentRelatedTabItems(row, translate);

  return [{
    key: `${sectionKeyPrefix}-related-tab`,
    items: relatedItems,
  }];
}
