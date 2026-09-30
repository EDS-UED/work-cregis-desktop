import { isPaymentEngineSharedOrderModeFilterMenu } from '../../payment-engine/paymentEngineSharedOrderModeFilterMenus';
import { isWaasOrderModeMenuItem } from '../waasMenuData';

/** WaaS 订单模式 EgFilter 字段 / snapshot / operators（含支付引擎共用菜单）。 */
export function shouldUseWaasOrderModeEgFilterSchema(menuItem: string): boolean {
  return (
    isWaasOrderModeMenuItem(menuItem)
    || isPaymentEngineSharedOrderModeFilterMenu(menuItem)
  );
}
