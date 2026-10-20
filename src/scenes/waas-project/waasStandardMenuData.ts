export const WAAS_STANDARD_DATA_LIST_MENU_ITEMS = [
  'Sub-Address',
  'Wallet Payout',
  'Sub-Address Payout',
  'History',
  'Processing',
  'Rule Configuration',
  'Task Record',
  'API Collection',
  'Collection History',
  'Collection Processing',
  'Callback Error',
  'History Callback',
] as const;

export type WaasStandardDataListMenuItem = (typeof WAAS_STANDARD_DATA_LIST_MENU_ITEMS)[number];

export const WAAS_STANDARD_CALLBACK_MENU_ITEMS = new Set<WaasStandardDataListMenuItem>([
  'Callback Error',
  'History Callback',
]);

/** 行点击进入详情的 WaaS 标准列表（Popup 或整页归集明细）。 */
export const WAAS_STANDARD_DETAIL_ON_ROW_CLICK_MENU_ITEMS = new Set<WaasStandardDataListMenuItem>([
  ...WAAS_STANDARD_CALLBACK_MENU_ITEMS,
  'Wallet Payout',
  'Sub-Address Payout',
  'History',
  'Processing',
  'Rule Configuration',
  'Task Record',
  'API Collection',
  'Collection History',
  'Collection Processing',
]);

export const WAAS_AMOUNT_ADDRESS_MENU_ITEMS = new Set<WaasStandardDataListMenuItem>([
  'Wallet Payout',
  'Sub-Address Payout',
  'History',
  'Processing',
  'Collection History',
  'Collection Processing',
  'API Collection',
]);

export function isWaasProcessingMenuItem(menuItem: string): boolean {
  return menuItem === 'Processing' || menuItem === 'Collection Processing';
}

export function isWaasAmountAddressMenuItem(menuItem: string): boolean {
  return WAAS_AMOUNT_ADDRESS_MENU_ITEMS.has(menuItem as WaasStandardDataListMenuItem);
}

export function isWaasStandardDataListMenuItem(
  label: string,
): label is WaasStandardDataListMenuItem {
  return (WAAS_STANDARD_DATA_LIST_MENU_ITEMS as readonly string[]).includes(label);
}

export function shouldOpenWaasStandardDetailOnRowClick(menuItem: string): boolean {
  return WAAS_STANDARD_DETAIL_ON_ROW_CLICK_MENU_ITEMS.has(menuItem as WaasStandardDataListMenuItem);
}
