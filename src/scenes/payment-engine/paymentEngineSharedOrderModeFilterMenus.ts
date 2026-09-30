/** 支付引擎与 WaaS 订单模式共用 EgFilter 字段 / snapshot 的菜单。 */
export const PAYMENT_ENGINE_SHARED_ORDER_MODE_FILTER_MENUS = [
  'Payment Exception Record',
  'Callback Error',
  'History Callback',
] as const;

export type PaymentEngineSharedOrderModeFilterMenu =
  (typeof PAYMENT_ENGINE_SHARED_ORDER_MODE_FILTER_MENUS)[number];

export function isPaymentEngineSharedOrderModeFilterMenu(
  menuItem: string,
): menuItem is PaymentEngineSharedOrderModeFilterMenu {
  return (PAYMENT_ENGINE_SHARED_ORDER_MODE_FILTER_MENUS as readonly string[]).includes(menuItem);
}
