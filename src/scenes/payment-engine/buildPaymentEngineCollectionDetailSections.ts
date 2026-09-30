import {
  createDetailApplyItemRow,
  type DetailSectionData,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineCollectionDetailView } from './paymentEngineCollectionDetailView';

export function buildPaymentEngineCollectionDetailConditionSections(
  view: PaymentEngineCollectionDetailView,
  translate: (key: string) => string,
): DetailSectionData[] {
  const { conditions } = view;
  const amountRangeLabel = conditions.collectionAmountRangeKey === 'Unlimited'
    ? translate('Unlimited')
    : conditions.collectionAmountRangeKey;
  const networkTag = conditions.collectionNetworkLabel.trim();

  return [{
    key: 'collection-detail-conditions',
    title: translate('Collection Conditions'),
    items: [
      createDetailApplyItemRow('brand-number', {
        key: 'collection-detail-number',
        title: translate('Collection Number'),
        value: conditions.collectionNumber,
      }),
      createDetailApplyItemRow('crypto', {
        key: 'collection-detail-currency',
        title: translate('Token'),
        value: conditions.collectionSymbol,
        valueSymbolCrypto: conditions.collectionCryptoName,
        valueIcon: conditions.collectionCryptoName,
        tag: networkTag,
      }),
      createDetailApplyItemRow('text', {
        key: 'collection-detail-amount-range',
        title: translate('Collection Amount Range'),
        value: amountRangeLabel,
      }),
      createDetailApplyItemRow('receiver', {
        key: 'collection-detail-receiving-address',
        title: translate('Arrival Address'),
        value: conditions.receivingAddress,
        tag: conditions.receivingAlias ?? '',
      }),
    ],
  }];
}

export function buildPaymentEngineCollectionDetailProgressTitle(
  view: PaymentEngineCollectionDetailView,
  translate: (key: string) => string,
  elapsedTime: string,
): string {
  return `${translate('Collection Progress')} · ${translate('Running For')} ${elapsedTime}`;
}

export function buildPaymentEngineCollectionDetailProgressMetric(
  value: string,
  translate: (key: string) => string,
): string {
  return `${value} ${translate('Signing transaction count unit')}`.trim();
}

export function buildPaymentEngineCollectionDetailInitiatorText(
  view: PaymentEngineCollectionDetailView,
  translate: (key: string) => string,
): string {
  return `${view.meta.initiatorName} ${translate('Submitted Request')}`.trim();
}

export function buildPaymentEngineCollectionDetailMinerFeeText(
  view: PaymentEngineCollectionDetailView,
  translate: (key: string) => string,
): string {
  return `${translate('Miner Fee')} ${formatEmptyDisplayValue(view.meta.minerFee)}`.trim();
}
