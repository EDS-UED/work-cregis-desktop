import { isPaymentEngineSharedOrderModeFilterMenu } from '../../payment-engine/paymentEngineSharedOrderModeFilterMenus';
import { isWaasOrderModeMenuItem } from '../waasMenuData';
import {
  isWaasStandardDataListMenuItem,
  WAAS_STANDARD_CALLBACK_MENU_ITEMS,
  type WaasStandardDataListMenuItem,
} from '../waasStandardMenuData';

/** WaaS 壳层传入，区分同 label 菜单在标准 / 订单模式下的 EgFilter 字段集。 */
export type WaasEgFilterListMode = 'standard' | 'order-mode';

/** WaaS 订单模式 EgFilter 字段 / snapshot / operators（含支付引擎共用菜单）。 */
export function shouldUseWaasOrderModeEgFilterSchema(
  menuItem: string,
  listMode?: WaasEgFilterListMode,
): boolean {
  if (listMode === 'order-mode') {
    return (
      isWaasOrderModeMenuItem(menuItem)
      || isPaymentEngineSharedOrderModeFilterMenu(menuItem)
    );
  }

  if (listMode === 'standard') {
    return false;
  }

  if (isPaymentEngineSharedOrderModeFilterMenu(menuItem)) {
    return true;
  }

  if (
    isWaasStandardDataListMenuItem(menuItem)
    && WAAS_STANDARD_CALLBACK_MENU_ITEMS.has(menuItem as WaasStandardDataListMenuItem)
  ) {
    return false;
  }

  return isWaasOrderModeMenuItem(menuItem);
}
