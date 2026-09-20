export const WAAS_STANDARD_DATA_LIST_MENU_ITEMS = [
  'Rule Configuration',
  'Task Record',
  'API Collection',
  'History',
  'Callback Error',
  'History Callback',
] as const;

export type WaasStandardDataListMenuItem = (typeof WAAS_STANDARD_DATA_LIST_MENU_ITEMS)[number];

export const WAAS_STANDARD_CALLBACK_MENU_ITEMS = new Set<WaasStandardDataListMenuItem>([
  'Callback Error',
  'History Callback',
]);

export function isWaasStandardDataListMenuItem(
  label: string,
): label is WaasStandardDataListMenuItem {
  return (WAAS_STANDARD_DATA_LIST_MENU_ITEMS as readonly string[]).includes(label);
}

export function shouldOpenWaasStandardDetailOnRowClick(menuItem: string): boolean {
  return WAAS_STANDARD_CALLBACK_MENU_ITEMS.has(menuItem as WaasStandardDataListMenuItem);
}
