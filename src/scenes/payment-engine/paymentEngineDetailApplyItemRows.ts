import {
  createDetailApplyItemRow,
  type DetailApplyItemRowOverrides,
  type DetailItemData,
} from '@eds/desktop-components';

export type PaymentEngineTimeRowOverrides = DetailApplyItemRowOverrides & {
  key: string;
  title: string;
  value: string;
};

/** 详情页仅一条时间字段：Apply_Item `time` 变体默认 eds-calendar。 */
export function createPaymentEngineDetailTimeRow(
  overrides: PaymentEngineTimeRowOverrides,
): DetailItemData {
  return createDetailApplyItemRow('time', overrides);
}

/** 详情页多条时间字段：首条 calendar-start，其余 calendar-end；仅一条时用设计系统默认。 */
export function createPaymentEngineDetailTimeRowByIndex(
  overrides: PaymentEngineTimeRowOverrides,
  index: number,
  total: number,
): DetailItemData {
  if (total <= 1) {
    return createPaymentEngineDetailTimeRow(overrides);
  }
  if (index === 0) {
    return createPaymentEngineTransferCreationTimeRow(overrides);
  }
  return createPaymentEngineTransferBlockTimeRow(overrides);
}

/** 转账/退款详情区「*创建时间」→ eds-calendar-start（仅与同页其它时间行成对使用）。 */
export function createPaymentEngineTransferCreationTimeRow(
  overrides: PaymentEngineTimeRowOverrides,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('time', overrides),
    titleIcon: 'eds-calendar-start',
  };
}

/** 转账/退款详情区区块/完成时间 → eds-calendar-end（与同页首条时间行成对）。 */
export function createPaymentEngineTransferBlockTimeRow(
  overrides: PaymentEngineTimeRowOverrides,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('time', overrides),
    titleIcon: 'eds-calendar-end',
  };
}
