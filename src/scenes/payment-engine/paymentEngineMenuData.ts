import { getCregisModuleMenuGroups } from '@eds/desktop-components';
import { flattenModuleMenuPresetItemLabels } from '@/presets/module-menu/moduleMenuPresetHelpers';

export const PAYMENT_ENGINE_SETTINGS_MENU_ITEM = 'Settings';

export const PAYMENT_ENGINE_RECORD_MENU_ITEMS = flattenModuleMenuPresetItemLabels(
  getCregisModuleMenuGroups('Payment Engine'),
) as readonly string[];

export type PaymentEngineRecordMenuItem = (typeof PAYMENT_ENGINE_RECORD_MENU_ITEMS)[number];

export const DEFAULT_PAYMENT_ENGINE_MENU_ITEM: PaymentEngineRecordMenuItem = 'Payment Record';

export function isPaymentEngineRecordMenuItem(
  label: string,
): label is PaymentEngineRecordMenuItem {
  return (PAYMENT_ENGINE_RECORD_MENU_ITEMS as readonly string[]).includes(label);
}

export function resolveDefaultPaymentEngineMenuItem(): string {
  return DEFAULT_PAYMENT_ENGINE_MENU_ITEM;
}
