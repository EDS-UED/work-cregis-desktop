import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type {
  PaymentEngineOrderBulkTransferRecord,
  PaymentEngineOrderPaymentRecord,
  PaymentEngineOrderRefundRecord,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import {
  resolvePaymentEngineOrderStatusLabelKey,
  resolvePaymentEngineOrderStatusTagVariant,
} from './paymentEngineOrderStatusLabels';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';

function resolveOrderRecordHeadlineTagStatus(
  status: PaymentEngineRecordRow['status'],
): TagStatus {
  const variant = resolvePaymentEngineOrderStatusTagVariant(status);
  if (variant.kind === 'status') {
    return variant.status;
  }
  return 'ready';
}

export function resolvePaymentEngineOrderRecordHeadlineStatus(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): { label: string; status: TagStatus } {
  return {
    label: translate(resolvePaymentEngineOrderStatusLabelKey(row.status)),
    status: resolveOrderRecordHeadlineTagStatus(row.status),
  };
}

function resolveAmountNetworkTag(row: PaymentEngineRecordRow): string {
  return (row.currencyNetwork ?? row.networkLabel ?? '').trim();
}

function resolveOrderAmountInReceivingCurrency(row: PaymentEngineRecordRow): string {
  return `${row.orderAmount} ${row.receivedSymbol}`;
}

function resolveActualReceivedDisplay(row: PaymentEngineRecordRow): string {
  if (!row.receivedAmount.trim()) {
    return formatEmptyDisplayValue('');
  }
  return `${row.receivedAmount} ${row.receivedSymbol}`;
}

function buildOrderDetailTabItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const cryptoName = row.currencyCryptoName
    ?? row.currencySymbol
    ?? row.orderSymbol;
  const orderSymbol = row.currencySymbol ?? row.orderSymbol;
  const networkTag = resolveAmountNetworkTag(row);

  return [
    createDetailApplyItemRow('crypto', {
      key: 'order-currency',
      title: translate('Order Currency'),
      value: orderSymbol,
      valueSymbolCrypto: cryptoName,
      valueIcon: cryptoName,
      tag: networkTag,
    }),
    createDetailApplyItemRow('brand-number', {
      key: 'order-id',
      title: translate('Order ID'),
      value: formatEmptyDisplayValue(row.id),
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'merchant-order-id',
      title: translate('Merchant Order ID'),
      value: row.merchantOrderId,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'exchange-rate',
        title: translate('Exchange Rate'),
        value: formatEmptyDisplayValue(row.exchangeRate),
      }),
      titleIcon: 'eds-exchange-rates',
    },
    createDetailApplyItemRow('amount', {
      key: 'order-amount-receiving-currency',
      title: translate('Order Amount in Receiving Currency'),
      value: resolveOrderAmountInReceivingCurrency(row),
      tag: networkTag,
    }),
    createDetailApplyItemRow('amount', {
      key: 'actual-received-amount',
      title: translate('Actual Received Amount'),
      value: resolveActualReceivedDisplay(row),
      tag: networkTag,
    }),
    createDetailApplyItemRow('time', {
      key: 'created-at',
      title: translate('Creation Time'),
      value: row.createdAt,
    }),
  ];
}

function resolvePaymentSectionTitleKey(
  payment: PaymentEngineOrderPaymentRecord,
): 'First Payment' | 'Additional Payment' {
  return payment.kind === 'additional' ? 'Additional Payment' : 'First Payment';
}

function resolvePaymentTimeLabelKey(
  payment: PaymentEngineOrderPaymentRecord,
): 'Creation Time' | 'Payment Block Timestamp' {
  return payment.kind === 'additional' ? 'Creation Time' : 'Payment Block Timestamp';
}

function buildPaymentSectionItems(
  payment: PaymentEngineOrderPaymentRecord,
  translate: (key: string) => string,
): DetailItemData[] {
  const networkTag = payment.networkLabel?.trim() ?? '';
  const amountValue = `${payment.amount} ${payment.symbol}`;

  return [
    createDetailApplyItemRow('brand-number', {
      key: `payment-id-${payment.paymentId}`,
      title: translate('Payment ID'),
      value: payment.paymentId,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: `payment-wallet-${payment.paymentId}`,
        title: translate('Payment Wallet'),
        value: payment.paymentWallet,
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('amount', {
      key: `payment-amount-${payment.paymentId}`,
      title: translate('Payment Amount'),
      value: amountValue,
      tag: networkTag,
    }),
    payment.kind === 'additional'
      ? createPaymentEngineTransferCreationTimeRow({
          key: `payment-time-${payment.paymentId}`,
          title: translate(resolvePaymentTimeLabelKey(payment)),
          value: payment.blockTimestamp,
        })
      : createPaymentEngineTransferBlockTimeRow({
          key: `payment-time-${payment.paymentId}`,
          title: translate(resolvePaymentTimeLabelKey(payment)),
          value: payment.blockTimestamp,
        }),
    createDetailApplyItemRow('sender', {
      key: `payment-sender-${payment.paymentId}`,
      title: translate('Sender'),
      value: payment.senderAddress,
      tag: payment.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: `payment-receiver-${payment.paymentId}`,
      title: translate('Receiver'),
      value: payment.receiverAddress,
      tag: payment.receiverAlias ?? '',
    }),
    createDetailApplyItemRow('txid', {
      key: `payment-txid-${payment.paymentId}`,
      title: translate('Transaction hash'),
      value: payment.txHash,
    }),
  ];
}

function buildRefundStatusDetailItem(
  refund: PaymentEngineOrderRefundRecord,
  translate: (key: string) => string,
): DetailItemData {
  const statusLabel = refund.status === 'pending'
    ? translate('Refunding')
    : refund.status === 'success'
      ? translate('Refund Completed')
      : translate('Refund Failed');

  const tagStatus = refund.status === 'pending'
    ? 'warning'
    : refund.status === 'success'
      ? 'success'
      : 'danger';

  return {
    ...createDetailApplyItemRow('status', {
      key: 'refund-status',
      title: translate('Refund Status'),
      tag: statusLabel,
    }),
    tagFamily: 'status',
    tagStatus,
    valueTagOnly: true,
    value: '',
  };
}

function buildRefundInformationItems(
  refund: PaymentEngineOrderRefundRecord,
  translate: (key: string) => string,
): DetailItemData[] {
  const networkTag = refund.networkLabel?.trim() ?? '';

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'refund-id',
      title: translate('Refund ID'),
      value: refund.refundId,
    }),
    buildRefundStatusDetailItem(refund, translate),
    {
      ...createDetailApplyItemRow('text', {
        key: 'refund-type',
        title: translate('Refund Type'),
        value: translate(refund.refundTypeKey),
      }),
      titleIcon: 'eds-business-type',
    },
    {
      ...createDetailApplyItemRow('brand-number', {
        key: 'payer-id',
        title: translate('Payer ID'),
        value: refund.payerId,
      }),
      titleIcon: 'eds-user-information',
    },
    createDetailApplyItemRow('time', {
      key: 'refund-created-at',
      title: translate('Creation Time'),
      value: refund.createdAt,
    }),
    createPaymentEngineTransferBlockTimeRow({
      key: 'refund-block-timestamp',
      title: translate('Refund Block Timestamp'),
      value: refund.blockTimestamp,
    }),
    createDetailApplyItemRow('sender', {
      key: 'refund-sender',
      title: translate('Sender'),
      value: refund.senderAddress,
      tag: refund.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'refund-receiver',
      title: translate('Receiver'),
      value: refund.receiverAddress,
      tag: refund.receiverAlias ?? '',
    }),
    createDetailApplyItemRow('amount', {
      key: 'refund-amount',
      title: translate('Refund Amount'),
      value: `${refund.refundAmount} ${refund.refundSymbol}`,
      tag: networkTag,
    }),
    createDetailApplyItemRow('fee', {
      key: 'refund-fee',
      title: translate('Refund Fee'),
      value: refund.refundFee,
    }),
    createDetailApplyItemRow('amount', {
      key: 'actual-refund-amount',
      title: translate('Actual Refund Amount'),
      value: refund.actualRefundAmount,
      tag: networkTag,
    }),
  ];

  if (refund.blockEvent) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'refund-block-event',
      title: translate('Refund Block Event'),
      value: refund.blockEvent,
    }));
  }

  if (refund.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'refund-tx-hash',
      title: translate('Transaction hash'),
      value: refund.txHash,
    }));
  }

  return items;
}

function buildBulkTransferStatusDetailItem(
  bulkTransfer: PaymentEngineOrderBulkTransferRecord,
  translate: (key: string) => string,
): DetailItemData {
  const statusLabel = bulkTransfer.status === 'pending'
    ? translate('Transferring')
    : bulkTransfer.status === 'success'
      ? translate('Bulk Transfer Completed')
      : translate('Transfer Failed');

  const tagStatus = bulkTransfer.status === 'pending'
    ? 'warning'
    : bulkTransfer.status === 'success'
      ? 'success'
      : 'danger';

  return {
    ...createDetailApplyItemRow('status', {
      key: 'bulk-transfer-status',
      title: translate('Bulk Transfer Status'),
      tag: statusLabel,
    }),
    tagFamily: 'status',
    tagStatus,
    valueTagOnly: true,
    value: '',
  };
}

function buildBulkTransferDetailItems(
  bulkTransfer: PaymentEngineOrderBulkTransferRecord,
  translate: (key: string) => string,
): DetailItemData[] {
  const networkTag = bulkTransfer.networkLabel?.trim() ?? '';

  return [
    createDetailApplyItemRow('brand-number', {
      key: 'bulk-transfer-id',
      title: translate('Bulk Transfer ID'),
      value: bulkTransfer.bulkTransferId,
    }),
    buildBulkTransferStatusDetailItem(bulkTransfer, translate),
    {
      ...createDetailApplyItemRow('sender', {
        key: 'bulk-transfer-address',
        title: translate('Bulk Transfer Address'),
        value: bulkTransfer.transferAddress,
        tag: '',
      }),
      titleIcon: 'eds-blockchain-address',
    },
    createDetailApplyItemRow('time', {
      key: 'bulk-transfer-created-at',
      title: translate('Bulk Transfer Creation Time'),
      value: bulkTransfer.createdAt,
    }),
    createDetailApplyItemRow('amount', {
      key: 'order-transferred-amount',
      title: translate('Order Transferred Amount'),
      value: `${bulkTransfer.transferredAmount} ${bulkTransfer.transferredSymbol}`,
      tag: networkTag,
    }),
    createDetailApplyItemRow('fee', {
      key: 'order-service-fee',
      title: translate('Order Service Fee'),
      value: bulkTransfer.serviceFee,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'order-service-fee-deducted-from',
        title: translate('Order Service Fee Deducted from'),
        value: translate(bulkTransfer.serviceFeeDeductedFromKey),
      }),
      titleIcon: 'eds-suspicious-dollar',
    },
  ];
}

export type PaymentEngineOrderRecordDetailTabKind = 'order' | 'payment' | 'settlement';

export function resolvePaymentEngineOrderRecordDetailTabKinds(
  row: PaymentEngineRecordRow,
): PaymentEngineOrderRecordDetailTabKind[] {
  const kinds: PaymentEngineOrderRecordDetailTabKind[] = ['order'];

  if ((row.orderPayments?.length ?? 0) > 0) {
    kinds.push('payment');
  }

  if (row.orderRefund || row.orderBulkTransfer) {
    kinds.push('settlement');
  }

  return kinds;
}

export function resolvePaymentEngineOrderRecordTabLabels(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): string[] {
  return resolvePaymentEngineOrderRecordDetailTabKinds(row).map((kind) => {
    if (kind === 'order') return translate('Order Detail');
    if (kind === 'payment') return translate('Payment Information');
    if (row.orderRefund) return translate('Refund Information');
    return translate('Bulk Transfer Detail');
  });
}

export function buildPaymentEngineOrderRecordDetailSections(
  row: PaymentEngineRecordRow,
  activeTab: number,
  translate: (key: string) => string,
): DetailSectionData[] {
  const tabKind = resolvePaymentEngineOrderRecordDetailTabKinds(row)[activeTab] ?? 'order';

  if (tabKind === 'order') {
    return [{
      key: 'order-detail',
      items: buildOrderDetailTabItems(row, translate),
    }];
  }

  if (tabKind === 'payment') {
    const payments = row.orderPayments ?? [];
    const showPaymentSectionTitles = payments.length > 1;

    return payments.map((payment, index) => ({
      key: `payment-${payment.kind}-${index}`,
      title: showPaymentSectionTitles
        ? translate(resolvePaymentSectionTitleKey(payment))
        : undefined,
      showDivider: index < payments.length - 1,
      items: buildPaymentSectionItems(payment, translate),
    }));
  }

  if (row.orderRefund) {
    return [{
      key: 'refund-information',
      items: buildRefundInformationItems(row.orderRefund, translate),
    }];
  }

  if (row.orderBulkTransfer) {
    return [{
      key: 'bulk-transfer-detail',
      items: buildBulkTransferDetailItems(row.orderBulkTransfer, translate),
    }];
  }

  return [];
}
