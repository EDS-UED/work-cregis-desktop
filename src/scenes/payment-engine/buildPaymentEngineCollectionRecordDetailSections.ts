import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';
import { resolvePaymentCollectionRecordDetail } from './paymentEngineCollectionRecordDetailData';

function buildCollectionRecordOverviewItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCollectionRecordDetail(row, menuItem);

  return [
    createDetailApplyItemRow('text', {
      key: 'collection-record-business-type',
      title: translate('Business Type'),
      value: translate(detail.businessTypeKey),
    }),
    {
      ...createDetailApplyItemRow('initiated-by', {
        key: 'collection-record-submitted-by',
        title: translate('Submitted Request'),
        value: detail.submittedBy,
      }),
      showValueSymbol: true,
      valueSymbolKind: undefined,
    },
    createDetailApplyItemRow('brand-number', {
      key: 'collection-record-collection-number',
      title: translate('Collection Number'),
      value: detail.collectionNumber,
    }),
    createPaymentEngineTransferCreationTimeRow({
      key: 'collection-record-start-time',
      title: translate('Start Time'),
      value: detail.startTime,
    }),
  ];
}

function buildCollectionRecordTransferItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentCollectionRecordDetail(row, menuItem);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('sender', {
      key: 'collection-record-sender',
      title: translate('Sender'),
      value: detail.senderAddress,
      tag: detail.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'collection-record-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'collection-record-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.minerFee) {
    items.push(createDetailApplyItemRow('fee', {
      key: 'collection-record-miner-fee',
      title: translate('Miner Fee'),
      value: detail.minerFee,
    }));
  }

  if (detail.completionTime) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'collection-record-completion-time',
      title: translate('Completion Time'),
      value: detail.completionTime,
    }));
  }

  return items;
}

export function buildPaymentEngineCollectionRecordDetailSections(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'collection-record-overview',
      showDivider: true,
      items: buildCollectionRecordOverviewItems(row, menuItem, translate),
    },
    {
      key: 'collection-record-transfer',
      items: buildCollectionRecordTransferItems(row, menuItem, translate),
    },
  ];
}
