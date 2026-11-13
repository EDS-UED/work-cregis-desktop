import {
  createDetailApplyItemRow,
  getProcessedCrypto,
  type DetailItemData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';

export type DetailCurrencyAmountFields = {
  amountRowValue: string;
  amountCryptoSymbol: string;
  amountCryptoName: string;
  amountNetworkLabel: string;
};

const DEFAULT_DETAIL_CRYPTO_NAME = 'eds-btc-bitcoin';

function resolveDetailCryptoIconName(symbol: string, cryptoName: string): string {
  const trimmed = cryptoName.trim();
  if (trimmed && getProcessedCrypto(trimmed)) return trimmed;
  return (
    resolveCryptoNameFromSymbol(symbol)
    ?? DEFAULT_DETAIL_CRYPTO_NAME
  );
}

export function buildDetailCurrencyAmountItems(
  detail: DetailCurrencyAmountFields,
  translate: (key: string) => string,
): DetailItemData[] {
  const iconName = resolveDetailCryptoIconName(
    detail.amountCryptoSymbol,
    detail.amountCryptoName,
  );

  return [
    createDetailApplyItemRow('crypto', {
      key: 'currency',
      title: translate('Token'),
      value: detail.amountCryptoSymbol,
      valueSymbolCrypto: iconName,
      valueIcon: iconName,
      tag: detail.amountNetworkLabel.trim() ? detail.amountNetworkLabel : '',
    }),
  ];
}
