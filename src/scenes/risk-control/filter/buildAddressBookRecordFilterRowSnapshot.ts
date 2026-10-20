import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export function buildAddressBookRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const currencySymbol = String(row.currencySymbol ?? row.orderSymbol ?? '').trim();
  const currencyNetwork = String(row.currencyNetwork ?? row.networkLabel ?? '').trim();

  return {
    addressBookCurrency: currencySymbol,
    currencySymbol,
    currencyNetwork,
    address: String(row.walletToAddress ?? '').trim(),
    addressAlias: String(row.walletToAlias ?? '').trim(),
  };
}
