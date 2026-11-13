import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineDetailTimeRowByIndex,
  type PaymentEngineTimeRowOverrides,
} from './paymentEngineDetailApplyItemRows';
import { resolvePaymentApiCollectionRecordDetail } from './paymentEngineApiCollectionDetailData';

type ApiCollectionTimeRowFactory = (overrides: PaymentEngineTimeRowOverrides) => DetailItemData;

function buildApiCollectionOverviewItems(
  row: PaymentEngineRecordRow,
  detail: ReturnType<typeof resolvePaymentApiCollectionRecordDetail>,
  translate: (key: string) => string,
  timeRow: ApiCollectionTimeRowFactory,
): DetailItemData[] {
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether usd';
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
    timeRow({
      key: 'api-collection-created-at',
      title: translate('Creation Time'),
      value: detail.createdAt,
    }),
  ];
}

function buildApiCollectionTransferItems(
  detail: ReturnType<typeof resolvePaymentApiCollectionRecordDetail>,
  translate: (key: string) => string,
  timeRow: ApiCollectionTimeRowFactory,
): DetailItemData[] {
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
    items.push(timeRow({
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
  const detail = resolvePaymentApiCollectionRecordDetail(row);
  const timeFieldTotal = detail.completionTime ? 2 : 1;
  let timeFieldIndex = 0;
  const timeRow: ApiCollectionTimeRowFactory = (overrides) =>
    createPaymentEngineDetailTimeRowByIndex(overrides, timeFieldIndex++, timeFieldTotal);

  return [
    {
      key: 'api-collection-detail',
      showDivider: false,
      items: [
        ...buildApiCollectionOverviewItems(row, detail, translate, timeRow),
        ...buildApiCollectionTransferItems(detail, translate, timeRow),
      ],
    },
  ];
}
