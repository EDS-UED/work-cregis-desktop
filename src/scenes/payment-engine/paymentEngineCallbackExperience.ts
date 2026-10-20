import type { PaymentEngineRecordColumnConfig } from './paymentEngineRecordConfigs';
import {
  isCallbackErrorRecordMenuItem,
  isHistoryCallbackRecordMenuItem,
} from './paymentEngineOrderRecordData';

export type PaymentEngineCallbackExperience = 'order-mode' | 'standard';

/** 订单模式 / 支付引擎回调 UI；标准 WaaS 为 5 列异常 + 4 列历史（businessType 首列）。 */
export function resolvePaymentEngineCallbackExperience(
  menuItem: string,
  columns: readonly PaymentEngineRecordColumnConfig[],
): PaymentEngineCallbackExperience {
  if (
    !isCallbackErrorRecordMenuItem(menuItem)
    && !isHistoryCallbackRecordMenuItem(menuItem)
  ) {
    return 'order-mode';
  }
  return columns[0]?.key === 'callbackAmountBusinessType' ? 'standard' : 'order-mode';
}

export function isOrderModeCallbackExperience(
  experience: PaymentEngineCallbackExperience,
): boolean {
  return experience === 'order-mode';
}
