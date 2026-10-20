import { isPaymentEngineSharedOrderModeFilterMenu } from '../paymentEngineSharedOrderModeFilterMenus';
import {
  isPaymentOrderRecordMenuItem,
  isPaymentSettlementRecordMenuItem,
} from '../paymentEngineOrderRecordData';

/** 支付引擎 DataList 启用 EgFilter 的菜单。 */
export function paymentEngineDataListShowsEgFilter(menuItem: string | undefined): boolean {
  const resolved = menuItem ?? '';
  return (
    isPaymentOrderRecordMenuItem(resolved)
    || isPaymentSettlementRecordMenuItem(resolved)
    || isPaymentEngineSharedOrderModeFilterMenu(resolved)
  );
}

export function shouldUsePaymentRecordEgFilterSchema(menuItem: string): boolean {
  return menuItem === 'Payment Record';
}

export function shouldUseSettlementRecordEgFilterSchema(menuItem: string): boolean {
  return menuItem === 'Settlement Record';
}
