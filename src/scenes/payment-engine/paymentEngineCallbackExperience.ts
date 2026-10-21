import type { WaasEgFilterListMode } from '@/scenes/waas-project/filter/shouldUseWaasOrderModeEgFilterSchema';
import type { PaymentEngineRecordColumnConfig } from './paymentEngineRecordConfigs';
import {
  isCallbackErrorRecordMenuItem,
  isHistoryCallbackRecordMenuItem,
} from './paymentEngineOrderRecordData';

export type PaymentEngineCallbackExperience =
  | 'standard'
  | 'order-mode'
  | 'payment-engine';

/** 标准 WaaS / WaaS 订单模式 / 支付引擎 · 异常与历史回调 UI 与 mock 数据集。 */
export function resolvePaymentEngineCallbackExperience(
  menuItem: string,
  columns: readonly PaymentEngineRecordColumnConfig[],
  waasEgFilterListMode?: WaasEgFilterListMode,
): PaymentEngineCallbackExperience {
  if (
    !isCallbackErrorRecordMenuItem(menuItem)
    && !isHistoryCallbackRecordMenuItem(menuItem)
  ) {
    return 'order-mode';
  }

  const firstColumnKey = columns[0]?.key;
  if (
    waasEgFilterListMode === 'standard'
    || firstColumnKey === 'callbackAmountBusinessType'
    || firstColumnKey === 'callbackBusinessTypeAddress'
    || firstColumnKey === 'callbackBusinessTypeUrl'
  ) {
    return 'standard';
  }

  if (waasEgFilterListMode === 'order-mode') {
    return 'order-mode';
  }

  return 'payment-engine';
}

/** 订单模式与支付引擎共用 4 列列表 + 详情 Tab 结构。 */
export function isOrderModeCallbackExperience(
  experience: PaymentEngineCallbackExperience,
): boolean {
  return experience === 'order-mode' || experience === 'payment-engine';
}
