import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEnginePaymentExceptionDetailRecord } from './paymentEngineRecordConfigs';
import { resolvePaymentExceptionRecordDetail } from './paymentEnginePaymentExceptionDetailData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';

function buildTransferApprovalStatusItem(
  detail: PaymentEnginePaymentExceptionDetailRecord,
  translate: (key: string) => string,
): DetailItemData {
  const statusLabel = detail.transferApprovalStatus === 'refunding'
    ? translate('Refunding')
    : detail.transferApprovalStatus === 'transferred'
      ? translate('Transferred')
      : translate('Transfer Failed');

  const tagStatus = detail.transferApprovalStatus === 'refunding'
    ? 'warning'
    : detail.transferApprovalStatus === 'transferred'
      ? 'success'
      : 'danger';

  return {
    ...createDetailApplyItemRow('status', {
      key: 'payment-exception-approval-status',
      title: translate('Approval Status'),
      tag: statusLabel,
    }),
    tagFamily: 'status',
    tagStatus,
    valueTagOnly: true,
    value: '',
  };
}

function buildPaymentExceptionDetailItems(
  detail: PaymentEnginePaymentExceptionDetailRecord,
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether';
  const networkTag = detail.networkLabel?.trim() ?? row.currencyNetwork ?? '';

  const items: DetailItemData[] = [
    createDetailApplyItemRow('brand-number', {
      key: 'payment-exception-id',
      title: translate('Payment Exception ID'),
      value: detail.exceptionId,
    }),
    createDetailApplyItemRow('crypto', {
      key: 'payment-exception-token',
      title: translate('Token'),
      value: detail.transferSymbol,
      valueSymbolCrypto: cryptoName,
      valueIcon: cryptoName,
      tag: networkTag,
    }),
    createDetailApplyItemRow('sender', {
      key: 'payment-exception-sender',
      title: translate('Sender'),
      value: detail.senderAddress,
      tag: detail.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'payment-exception-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
    createDetailApplyItemRow('time', {
      key: 'payment-exception-created-at',
      title: translate('Creation Time'),
      value: detail.createdAt,
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'payment-exception-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  items.push(createDetailApplyItemRow('reason', {
    key: 'payment-exception-filtered-reason',
    title: translate('Filtered Reason'),
    value: translate(detail.filteredReasonKey),
  }));

  return items;
}

function buildPaymentExceptionTransferDetailItems(
  detail: PaymentEnginePaymentExceptionDetailRecord,
  translate: (key: string) => string,
): DetailItemData[] {
  const networkTag = detail.networkLabel?.trim() ?? '';

  const items: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('initiated-by', {
        key: 'payment-exception-initiated-by',
        title: translate('Initiated by'),
        value: formatEmptyDisplayValue(detail.initiatedBy),
      }),
      showValueSymbol: true,
      valueSymbolKind: undefined,
    },
    buildTransferApprovalStatusItem(detail, translate),
    createPaymentEngineTransferCreationTimeRow({
      key: 'payment-exception-transfer-creation-time',
      title: translate('Transfer Creation Time'),
      value: detail.createdAt,
    }),
    createPaymentEngineTransferBlockTimeRow({
      key: 'payment-exception-transfer-block-timestamp',
      title: translate('Transfer Block Timestamp'),
      value: detail.blockTimestamp,
    }),
    createDetailApplyItemRow('receiver', {
      key: 'payment-exception-transfer-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
    createDetailApplyItemRow('fee', {
      key: 'payment-exception-transfer-fee',
      title: translate('Transfer Fee'),
      value: detail.transferFee,
    }),
    createDetailApplyItemRow('amount', {
      key: 'payment-exception-actual-transferred-amount',
      title: translate('Actual Transferred Amount'),
      value: detail.actualTransferredAmount,
      tag: networkTag,
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'payment-exception-transfer-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.remark?.trim()) {
    items.push(createDetailApplyItemRow('memo', {
      key: 'payment-exception-remark',
      title: translate('Remark'),
      value: detail.remark,
    }));
  }

  return items;
}

export function buildPaymentEnginePaymentExceptionDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolvePaymentExceptionRecordDetail(row);

  return [
    {
      key: 'payment-exception-detail',
      title: translate('Payment Exception Detail'),
      showDivider: true,
      items: buildPaymentExceptionDetailItems(detail, row, translate),
    },
    {
      key: 'payment-exception-transfer-detail',
      title: translate('Payment Exception Transfer Details'),
      items: buildPaymentExceptionTransferDetailItems(detail, translate),
    },
  ];
}
