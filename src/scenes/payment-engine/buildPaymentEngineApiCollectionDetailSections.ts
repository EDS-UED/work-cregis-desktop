import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineTransferBlockTimeRow,
  createPaymentEngineTransferCreationTimeRow,
} from './paymentEngineDetailApplyItemRows';
import { resolvePaymentApiCollectionRecordDetail } from './paymentEngineApiCollectionDetailData';

function buildApiCollectionOverviewItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentApiCollectionRecordDetail(row);
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether';
  const networkTag = row.currencyNetwork?.trim() ?? '';

  return [
    createDetailApplyItemRow('crypto', {
      key: 'api-collection-token',
      title: translate('Token'),
      value: row.currencySymbol ?? row.orderSymbol,
      valueSymbolCrypto: cryptoName,
      valueIcon: cryptoName,
      tag: networkTag,
    }),
    createDetailApplyItemRow('ip', {
      key: 'api-collection-ip-address',
      title: translate('IP Address'),
      value: detail.ipAddress,
    }),
    createPaymentEngineTransferCreationTimeRow({
      key: 'api-collection-created-at',
      title: translate('Creation Time'),
      value: detail.createdAt,
    }),
  ];
}

function buildApiCollectionTransferItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentApiCollectionRecordDetail(row);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('sender', {
      key: 'api-collection-sender',
      title: translate('Sender'),
      value: detail.senderAddress,
      tag: detail.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'api-collection-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'api-collection-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.minerFee) {
    items.push(createDetailApplyItemRow('fee', {
      key: 'api-collection-miner-fee',
      title: translate('Miner Fee'),
      value: detail.minerFee,
    }));
  }

  if (detail.completionTime) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'api-collection-completion-time',
      title: translate('Completion Time'),
      value: detail.completionTime,
    }));
  }

  return items;
}

export function buildPaymentEngineApiCollectionDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'api-collection-overview',
      showDivider: true,
      items: buildApiCollectionOverviewItems(row, translate),
    },
    {
      key: 'api-collection-transfer',
      items: buildApiCollectionTransferItems(row, translate),
    },
  ];
}
