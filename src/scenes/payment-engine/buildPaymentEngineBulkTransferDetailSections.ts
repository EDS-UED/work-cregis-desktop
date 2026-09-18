import {
  createDetailApplyItemRow,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineBulkTransferDetailView } from './paymentEngineBulkTransferDetailView';
import { createPaymentEngineTransferCreationTimeRow } from './paymentEngineDetailApplyItemRows';

export function buildPaymentEngineBulkTransferDetailSections(
  view: PaymentEngineBulkTransferDetailView,
  translate: (key: string) => string,
): DetailSectionData[] {
  const { creationTime, summary } = view;

  return [
    {
      key: 'bulk-transfer-creation-meta',
      items: [
        createPaymentEngineTransferCreationTimeRow({
          key: 'bulk-transfer-order-creation-time',
          title: translate(creationTime.labelKey),
          value: creationTime.value,
        }),
      ],
    },
    {
      key: 'bulk-transfer-summary',
      title: translate(summary.titleKey),
      items: [
        createDetailApplyItemRow('brand-number', {
          key: 'bulk-transfer-order-id',
          title: translate('Bulk Transfer ID'),
          value: summary.transferId,
        }),
        createDetailApplyItemRow('crypto', {
          key: 'bulk-transfer-currency',
          title: translate('Currency'),
          value: summary.currency.symbol,
          valueSymbolCrypto: summary.currency.cryptoName,
          valueIcon: summary.currency.cryptoName,
          tag: summary.currency.networkTag,
        }),
        {
          ...createDetailApplyItemRow('receiver', {
            key: 'bulk-transfer-recipient',
            title: translate('Receiver'),
            value: summary.recipientAddress,
            tag: '',
          }),
          titleIcon: 'eds-blockchain-address',
        },
      ],
    },
  ];
}
