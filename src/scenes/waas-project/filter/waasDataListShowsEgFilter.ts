import { isPaymentEngineSharedOrderModeFilterMenu } from '../../payment-engine/paymentEngineSharedOrderModeFilterMenus';
import { isWaasOrderModeMenuItem } from '../waasMenuData';
import type { WaasStandardDataListMenuItem } from '../waasStandardMenuData';
import { isWaasStandardDataListMenuItem } from '../waasStandardMenuData';

/** WaaS 标准 / 订单模式 / 支付引擎共用菜单启用 EgFilter（归集记录父级、Settings 除外）。 */
export function waasDataListShowsEgFilter(menuItem: string | undefined): boolean {
  const resolved = menuItem ?? '';
  return (
    isWaasStandardDataListMenuItem(resolved)
    || isWaasOrderModeMenuItem(resolved)
    || isPaymentEngineSharedOrderModeFilterMenu(resolved)
  );
}

export type WaasDataListFilterMenuItem = WaasStandardDataListMenuItem;
