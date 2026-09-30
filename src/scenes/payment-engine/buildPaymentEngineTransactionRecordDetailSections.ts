import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';
import { resolvePaymentTransactionRecordDetail } from './paymentEngineTransactionRecordDetailData';

function buildTransactionRecordOverviewItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentTransactionRecordDetail(row, menuItem);

  return [
    createDetailApplyItemRow('brand-number', {
      key: 'transaction-record-cregis-id',
      title: translate('Cregis ID'),
      value: detail.cregisId,
    }),
    createDetailApplyItemRow('tripartite-number', {
      key: 'transaction-record-third-party-business-no',
      title: translate('Third-party Reference'),
      value: detail.thirdPartyBusinessNo,
    }),
    {
      ...createDetailApplyItemRow('initiated-by', {
        key: 'transaction-record-submitted-by',
        title: translate('Submitted Request'),
        value: detail.submittedBy,
      }),
      showValueSymbol: true,
      valueSymbolKind: undefined,
    },
    createPaymentEngineTransferCreationTimeRow({
      key: 'transaction-record-created-at',
      title: translate('Creation Time'),
      value: detail.createdAt,
    }),
  ];
}

function buildTransactionRecordTransferItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentTransactionRecordDetail(row, menuItem);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('sender', {
      key: 'transaction-record-sender',
      title: translate('Sender'),
      value: detail.senderAddress,
      tag: detail.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'transaction-record-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'transaction-record-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.blockNumber) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'transaction-record-block',
        title: translate('Block'),
        value: detail.blockNumber,
      }),
      titleIcon: 'eds-blockchain',
    });
  }

  if (detail.minerFee) {
    items.push(createDetailApplyItemRow('fee', {
      key: 'transaction-record-miner-fee',
      title: translate('Miner Fee'),
      value: detail.minerFee,
    }));
  }

  if (detail.completionTime) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'transaction-record-completion-time',
      title: translate('Completion Time'),
      value: detail.completionTime,
    }));
  }

  return items;
}

function buildTransactionRecordMemoItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentTransactionRecordDetail(row, menuItem);

  return [
    createDetailApplyItemRow('memo', {
      key: 'transaction-record-memo',
      title: translate('Memo'),
      value: detail.memo ?? '',
    }),
    createDetailApplyItemRow('remark', {
      key: 'transaction-record-remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(detail.remark),
    }),
  ];
}

export function buildPaymentEngineTransactionRecordDetailSections(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'transaction-record-overview',
      showDivider: true,
      items: buildTransactionRecordOverviewItems(row, menuItem, translate),
    },
    {
      key: 'transaction-record-transfer',
      showDivider: true,
      items: buildTransactionRecordTransferItems(row, menuItem, translate),
    },
    {
      key: 'transaction-record-memo',
      items: buildTransactionRecordMemoItems(row, menuItem, translate),
    },
  ];
}
