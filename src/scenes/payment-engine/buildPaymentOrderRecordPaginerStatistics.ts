import type { PaginerStatisticsItem } from '@eds/desktop-components';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type { PaymentEngineOrderStatus, PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

const PAYMENT_ORDER_RECORD_STATISTICS_BUCKETS: ReadonlyArray<{
  labelKey: string;
  status: PaymentEngineOrderStatus;
}> = [
  { labelKey: 'Partial Paid', status: 'additional-payment-required' },
  { labelKey: 'Paid', status: 'paid' },
  { labelKey: 'Transferred', status: 'transferred' },
];

function parseRecordDecimalAmount(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveStatisticsAmount(row: PaymentEngineRecordRow): number {
  const received = row.receivedAmount.trim();
  if (received) return parseRecordDecimalAmount(received);
  return parseRecordDecimalAmount(row.orderAmount);
}

function formatStatisticsTotal(total: number): string {
  if (!Number.isFinite(total) || total === 0) return '0';
  const normalized = total.toFixed(8).replace(/\.?0+$/, '');
  return formatGroupedDecimalAmount(normalized);
}

/** 支付记录 / 订单记录 Paginer 统计：按状态汇总实收（无实收则订单金额），仅展示数值。 */
export function buildPaymentOrderRecordPaginerStatistics(
  rows: readonly PaymentEngineRecordRow[],
  translate: (key: string) => string,
): PaginerStatisticsItem[] {
  return PAYMENT_ORDER_RECORD_STATISTICS_BUCKETS.map(({ labelKey, status }) => {
    const matchingRows = rows.filter((row) => row.status === status);
    let total = 0;

    for (const row of matchingRows) {
      total += resolveStatisticsAmount(row);
    }

    return {
      text: translate(labelKey),
      number: formatStatisticsTotal(total),
    };
  });
}
