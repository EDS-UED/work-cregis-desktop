import {
  createDetailApplyItemRow,
  type DetailItemData,
  type TagStatus,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  resolvePaymentEngineOrderStatusLabelKey,
  resolvePaymentEngineOrderStatusTagVariant,
} from './paymentEngineOrderStatusLabels';

export function buildPaymentEngineOrderStatusDetailItem(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  const labelKey = resolvePaymentEngineOrderStatusLabelKey(row.status);
  const variant = resolvePaymentEngineOrderStatusTagVariant(row.status);

  if (variant.kind === 'status') {
    return {
      ...createDetailApplyItemRow('status', {
        key: 'order-status',
        title: translate('Order Status'),
        tag: translate(labelKey),
      }),
      tagFamily: 'status',
      tagStatus: variant.status as TagStatus,
      valueTagOnly: true,
      value: '',
    };
  }

  return createDetailApplyItemRow('text', {
    key: 'order-status',
    title: translate('Order Status'),
    value: translate(labelKey),
  });
}
