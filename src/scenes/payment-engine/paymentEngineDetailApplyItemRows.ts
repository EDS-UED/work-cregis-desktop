import {
  createDetailApplyItemRow,
  type DetailApplyItemRowOverrides,
  type DetailItemData,
} from '@eds/desktop-components';

type PaymentEngineTimeRowOverrides = DetailApplyItemRowOverrides & {
  key: string;
  title: string;
  value: string;
};

/** 转账/退款详情区「*创建时间」→ eds-calendar-start（区别于信息区 Creation Time 的 eds-calendar）。 */
export function createPaymentEngineTransferCreationTimeRow(
  overrides: PaymentEngineTimeRowOverrides,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('time', overrides),
    titleIcon: 'eds-calendar-start',
  };
}

/** 转账/退款详情区区块/审批/更新时间 → eds-calendar-end。 */
export function createPaymentEngineTransferBlockTimeRow(
  overrides: PaymentEngineTimeRowOverrides,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('time', overrides),
    titleIcon: 'eds-calendar-end',
  };
}
