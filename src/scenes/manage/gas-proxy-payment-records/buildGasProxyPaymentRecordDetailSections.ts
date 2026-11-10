import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import type {
  GasProxyPaymentRecordRow,
  GasProxyTronProxyResources,
} from './gasProxyPaymentRecordTypes';

function buildTronProxyResourcesDisplay(
  resources: GasProxyTronProxyResources,
  translate: (catalogKey: string) => string,
): string {
  const segments: string[] = [];

  if (resources.bandwidthTrx?.trim()) {
    segments.push(
      translate('Gas proxy resource bandwidth segment').replace(
        '{amount}',
        resources.bandwidthTrx.trim(),
      ),
    );
  }
  if (resources.energyTrx?.trim()) {
    segments.push(
      translate('Gas proxy resource energy segment').replace(
        '{amount}',
        resources.energyTrx.trim(),
      ),
    );
  }
  if (resources.addressActivationTrx?.trim()) {
    segments.push(
      translate('Gas proxy resource activation segment').replace(
        '{amount}',
        resources.addressActivationTrx.trim(),
      ),
    );
  }

  return segments.join(' + ');
}

export function formatGasProxyPaymentRecordDetailHeadline(row: GasProxyPaymentRecordRow): string {
  if (row.isTronNetwork) {
    return row.deductedAmountFiatDisplay;
  }
  return `${row.deductedAmount} ${row.symbol}`;
}

export function resolveGasProxyPaymentRecordDetailEyebrow(
  row: GasProxyPaymentRecordRow,
  translate: (catalogKey: string) => string,
): string {
  return translate(row.transactionTypeKey);
}

export function buildGasProxyPaymentRecordDetailSections(
  row: GasProxyPaymentRecordRow,
  translate: (catalogKey: string) => string,
): DetailSectionData[] {
  const items: DetailItemData[] = [
    {
      ...createDetailApplyItemRow('text', {
        key: 'gas-proxy-deducted-account',
        title: translate('Deducted Account'),
        value: translate(row.accountKey),
      }),
      titleIcon: 'eds-fiat-currency',
    },
  ];

  const proxyResources = row.tronProxyResources;
  const proxyResourcesText =
    row.isTronNetwork && proxyResources
      ? buildTronProxyResourcesDisplay(proxyResources, translate)
      : '';

  if (proxyResourcesText.trim()) {
    items.push(
      createDetailApplyItemRow('text', {
        key: 'gas-proxy-resources',
        title: translate('Gas Proxy Payment Resources'),
        value: proxyResourcesText,
      }),
    );
  }

  items.push(
    createDetailApplyItemRow('crypto', {
      key: 'gas-proxy-transaction-currency',
      title: translate('Transaction Currency'),
      value: row.symbol,
      valueSymbolCrypto: row.cryptoName,
      valueIcon: row.cryptoName,
      tag: row.showNetwork ? row.networkLabel.trim() : '',
    }),
    createDetailApplyItemRow('txid', {
      key: 'gas-proxy-tx-hash',
      title: translate('Transaction hash'),
      value: row.txHash,
    }),
    createDetailApplyItemRow('time', {
      key: 'gas-proxy-time',
      title: translate('Time'),
      value: row.transactionTime,
    }),
  );

  return [{ items }];
}
