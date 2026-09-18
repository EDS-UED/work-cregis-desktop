import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineOrderRefundRecord } from './paymentEngineRecordConfigs';
import { resolvePaymentRefundRecordDetail } from './paymentEngineRefundRecordDetailData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';

function buildRefundApprovalStatusItem(
  refund: PaymentEngineOrderRefundRecord,
  translate: (key: string) => string,
): DetailItemData {
  const statusLabel = refund.status === 'pending'
    ? translate('Refunding')
    : refund.status === 'success'
      ? translate('Refunded')
      : translate('Refund Failed');

  const tagStatus = refund.status === 'pending'
    ? 'warning'
    : refund.status === 'success'
      ? 'success'
      : 'danger';

  return {
    ...createDetailApplyItemRow('status', {
      key: 'refund-approval-status',
      title: translate('Approval Status'),
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
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether';
  const networkTag = refund.networkLabel?.trim() ?? row.currencyNetwork ?? '';

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'refund-id',
      title: translate('Refund ID'),
      value: refund.refundId,
    }),
    createDetailApplyItemRow('crypto', {
      key: 'refund-token',
      title: translate('Token'),
      value: refund.refundSymbol,
      valueSymbolCrypto: cryptoName,
      valueIcon: cryptoName,
      tag: networkTag,
    }),
    createDetailApplyItemRow('time', {
      key: 'refund-created-at',
      title: translate('Creation Time'),
      value: refund.createdAt,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'refund-type',
        title: translate('Refund Type'),
        value: translate(refund.refundTypeKey),
      }),
      titleIcon: 'eds-business-type',
    },
  ];

  if (refund.refundReasonKey) {
    items.push(createDetailApplyItemRow('reason', {
      key: 'refund-reason',
      title: translate('Refund Reason'),
      value: translate(refund.refundReasonKey),
    }));
  }

  return items;
}

function buildRefundTransferDetailItems(
  refund: PaymentEngineOrderRefundRecord,
  translate: (key: string) => string,
): DetailItemData[] {
  const networkTag = refund.networkLabel?.trim() ?? '';

  const items: DetailItemData[] = [
    buildRefundApprovalStatusItem(refund, translate),
    {
      ...createDetailApplyItemRow('initiated-by', {
        key: 'refund-initiated-by',
        title: translate('Initiated by'),
        value: formatEmptyDisplayValue(refund.initiatedBy),
      }),
      showValueSymbol: true,
      valueSymbolKind: undefined,
    },
    createPaymentEngineTransferCreationTimeRow({
      key: 'refund-creation-time',
      title: translate('Refund Creation Time'),
      value: refund.createdAt,
    }),
    createPaymentEngineTransferBlockTimeRow({
      key: 'refund-block-timestamp',
      title: translate('Refund Block Timestamp'),
      value: refund.blockTimestamp,
    }),
  ];

  if (refund.approvalTime) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'refund-approval-time',
      title: translate('Refund Approval Time'),
      value: refund.approvalTime,
    }));
  }

  items.push(
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
  );

  if (refund.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'refund-tx-hash',
      title: translate('Transaction hash'),
      value: refund.txHash,
    }));
  }

  if (refund.remark?.trim()) {
    items.push(createDetailApplyItemRow('memo', {
      key: 'refund-remark',
      title: translate('Remark'),
      value: refund.remark,
    }));
  }

  return items;
}

export function buildPaymentEngineRefundRecordDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const refund = resolvePaymentRefundRecordDetail(row);

  return [
    {
      key: 'refund-information',
      title: translate('Refund Information'),
      showDivider: true,
      items: buildRefundInformationItems(refund, row, translate),
    },
    {
      key: 'refund-transfer-detail',
      title: translate('Refund Transfer Detail'),
      items: buildRefundTransferDetailItems(refund, translate),
    },
  ];
}
