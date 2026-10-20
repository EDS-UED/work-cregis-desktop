import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

export function buildPaymentEngineAmountHeadline(row: PaymentEngineRecordRow): string {
  const primary = `${row.orderAmount} ${row.orderSymbol}`.trim();
  const fiat = row.orderFiat?.trim() || row.receivedFiat?.trim();
  if (!fiat || fiat === primary) {
    return primary;
  }
  return `${primary} ≈ ${fiat}`;
}

/** 订单记录详情头部：仅展示法币订单金额（Figma Order Amount）。 */
export function buildPaymentEngineOrderRecordAmountHeadline(
  row: PaymentEngineRecordRow,
): string {
  const fiat = row.orderFiat?.trim();
  if (!fiat) {
    return `${row.orderAmount} ${row.orderSymbol}`.trim();
  }

  const match = /^([\d,.]+)\s+(\S+)$/.exec(fiat);
  if (!match) {
    return fiat;
  }

  const [, amount, symbol] = match;
  if (symbol === 'USD') {
    return `$${amount}`;
  }
  return `${amount} ${symbol}`;
}
