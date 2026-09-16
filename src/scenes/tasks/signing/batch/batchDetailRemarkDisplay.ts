import { EMPTY_DISPLAY } from '@/utils/formatEmptyDisplay';

const BATCH_DETAIL_REMARK_SAMPLES = [
  '',
  'Payroll batch payout',
  'Vendor settlement',
  '',
  'Quarterly close',
  'Treasury rebalance',
  'Urgent transfer',
  '',
  'Monthly reconciliation',
  'Ops reserve top-up',
] as const;

/** 批签详情列表备注列演示数据；空值统一 `--`。 */
export function resolveBatchDetailRemark(rowIndex: number): string {
  const sample = BATCH_DETAIL_REMARK_SAMPLES[rowIndex % BATCH_DETAIL_REMARK_SAMPLES.length];
  const trimmed = sample.trim();
  return trimmed || EMPTY_DISPLAY;
}
