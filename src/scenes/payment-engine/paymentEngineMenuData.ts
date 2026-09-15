export const PAYMENT_ENGINE_SETTINGS_MENU_ITEM = 'Settings';

export const PAYMENT_ENGINE_RECORD_MENU_ITEMS = [
  'Order Record',
  'Bulk Transfer Record',
  'Refund Record',
  'Payment Exception Record',
  'Wallet Payout',
  'Callback Error',
  'History Callback',
] as const;

export type PaymentEngineRecordMenuItem = (typeof PAYMENT_ENGINE_RECORD_MENU_ITEMS)[number];

export const DEFAULT_PAYMENT_ENGINE_MENU_ITEM: PaymentEngineRecordMenuItem = 'Order Record';

export const DEFAULT_WAAS_MENU_ITEM = 'Sub-Address';

export function isPaymentEngineRecordMenuItem(
  label: string,
): label is PaymentEngineRecordMenuItem {
  return (PAYMENT_ENGINE_RECORD_MENU_ITEMS as readonly string[]).includes(label);
}

