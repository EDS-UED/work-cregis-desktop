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
  isHistoryCallbackRecordMenuItem,
} from './paymentEngineOrderRecordData';
import { resolvePaymentCallbackErrorRecordDetail } from './paymentEngineCallbackErrorDetailData';
import type { PaymentEngineOrderStatus, PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
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
    tagFamily: 'system',
    tagSystemType: 'gray',
    valueTagOnly: true,
    value: '',
  };
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

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'callback-order-id',
      title: translate('Order ID'),
      value: detail.orderId,
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'callback-merchant-order-id',
      title: translate('Merchant Order ID'),
      value: detail.merchantOrderId,
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
): DetailSectionData[] {
  const tabKind = resolvePaymentEngineCallbackErrorDetailTabKinds(row)[activeTab] ?? 'callback';
  const sectionKeyPrefix = isHistoryCallbackRecordMenuItem(menuItem)
    ? 'history-callback'
    : 'callback-error';

  if (tabKind === 'callback') {
    return [{
      key: `${sectionKeyPrefix}-callback-tab`,
      items: buildCallbackTabItems(row, menuItem, translate),
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
