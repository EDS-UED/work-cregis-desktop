import type { TagColorfulStyle, TagStatus } from '@eds/desktop-components';
import type { PaymentEngineOrderStatus } from './paymentEngineRecordConfigs';

export type PaymentEngineOrderStatusTagVariant =
  | { kind: 'colorful'; colorfulStyle: TagColorfulStyle }
  | { kind: 'status'; status: TagStatus };

/** 支付订单状态 UI 标签（与 Tasks「Submitted Request」等协作文案隔离）。 */
export const PAYMENT_ENGINE_ORDER_STATUS_LABEL_KEYS: Partial<
  Record<PaymentEngineOrderStatus, string>
> = {
  initiated: 'New Order',
  'additional-payment-required': 'Additional Payment Required',
  paid: 'Paid',
  transferred: 'Transferred',
  cancelled: 'Canceled',
  expired: 'Expired',
};

export function resolvePaymentEngineOrderStatusLabelKey(
  status: PaymentEngineOrderStatus,
): string {
  return PAYMENT_ENGINE_ORDER_STATUS_LABEL_KEYS[status] ?? status;
}

const PAYMENT_ENGINE_ORDER_STATUS_TAG_VARIANTS: Partial<
  Record<PaymentEngineOrderStatus, PaymentEngineOrderStatusTagVariant>
> = {
  initiated: { kind: 'colorful', colorfulStyle: 'lime' },
  'additional-payment-required': { kind: 'status', status: 'danger' },
  paid: { kind: 'status', status: 'success' },
  transferred: { kind: 'status', status: 'success' },
  cancelled: { kind: 'status', status: 'invalid' },
  expired: { kind: 'status', status: 'invalid' },
};

export function resolvePaymentEngineOrderStatusTagVariant(
  status: PaymentEngineOrderStatus,
): PaymentEngineOrderStatusTagVariant {
  return (
    PAYMENT_ENGINE_ORDER_STATUS_TAG_VARIANTS[status] ?? { kind: 'status', status: 'success' }
  );
}
