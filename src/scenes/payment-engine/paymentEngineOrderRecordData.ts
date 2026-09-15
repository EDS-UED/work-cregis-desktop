import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

const ORDER_STATUSES: PaymentEngineRecordRow['status'][] = [
  'initiated',
  'additional-payment-required',
  'expired',
  'cancelled',
  'paid',
  'transferred',
];

const BULK_STATUSES: PaymentEngineRecordRow['status'][] = ['pending', 'success', 'failed'];
const REFUND_STATUSES: PaymentEngineRecordRow['status'][] = ['pending', 'success', 'failed'];

const CRYPTO_PRESETS = [
  { symbol: 'USDT', network: 'Ethereum', cryptoName: 'eds-usdt-tether' },
  { symbol: 'USDC', network: 'BNB Smart Chain', cryptoName: 'eds-usdc-usd-coin' },
  { symbol: 'ETH', network: 'Ethereum', cryptoName: 'eds-eth-ethereum' },
] as const;

function formatAmount(value: number): string {
  return formatGroupedDecimalAmount(value.toFixed(3));
}

function cryptoPreset(index: number) {
  return CRYPTO_PRESETS[index % CRYPTO_PRESETS.length]!;
}

export function buildPaymentEngineRecordRows(
  menuItem: string,
  count = 68,
): PaymentEngineRecordRow[] {
  if (menuItem === 'Bulk Transfer Record' || menuItem === 'Wallet Payout') {
    return Array.from({ length: count }, (_, index) => {
      const crypto = cryptoPreset(index);
      const transferIdPrefix = menuItem === 'Wallet Payout' ? 'WP' : 'BT';
      return {
        id: `${transferIdPrefix}-${88001 + index}`,
        merchantOrderId: `0x${(88001 + index).toString(16)}f3a9b2c1d4e5f6789012345678abcd`,
        status: BULK_STATUSES[index % BULK_STATUSES.length]!,
        createdAt: `2032-10-${String(20 + (index % 8)).padStart(2, '0')} 12:22:54`,
        receivedAmount: formatAmount(1200 + index * 125.5),
        receivedSymbol: crypto.symbol,
        orderAmount: formatAmount(1180 + index * 120),
        orderSymbol: crypto.symbol,
        orderFiat: `${formatAmount(1180 + index * 120)} ${crypto.symbol}`,
        currencySymbol: crypto.symbol,
        currencyNetwork: crypto.network,
        bulkTransferId: `${transferIdPrefix}R-${12001 + index}`,
      };
    });
  }

  if (menuItem === 'Refund Record') {
    return Array.from({ length: count }, (_, index) => {
      const crypto = cryptoPreset(index);
      const fiat = formatAmount(500 + index * 42.25);
      return {
        id: `RF-${77001 + index}`,
        merchantOrderId: `0x${(77001 + index).toString(16)}a1b2c3d4e5f6789012345678abcdef`,
        status: REFUND_STATUSES[index % REFUND_STATUSES.length]!,
        createdAt: `2032-10-${String(18 + (index % 8)).padStart(2, '0')} 09:15:00`,
        receivedAmount: fiat,
        receivedSymbol: crypto.symbol,
        receivedFiat: `${fiat} USDT`,
        orderAmount: fiat,
        orderSymbol: crypto.symbol,
        orderFiat: `${fiat} USDT`,
        currencySymbol: crypto.symbol,
        currencyNetwork: crypto.network,
        refundId: `RFD-${55001 + index}`,
      };
    });
  }

  return Array.from({ length: count }, (_, index) => {
    const status = ORDER_STATUSES[index % ORDER_STATUSES.length]!;
    const crypto = cryptoPreset(index);
    const fiatValue = formatAmount(195373.26 - index * 1200.5);
    const amount = formatAmount(index === 0 ? 5 : index === 1 ? 330 : 20.55);
    return {
      id: `po1442856738070${528 + index}`,
      merchantOrderId: `0x${(528 + index).toString(16)}f3a9b2c1d4e5f6789012345678abcd`,
      status,
      createdAt: '2032-10-23 12:22:54',
      receivedAmount: amount,
      receivedSymbol: crypto.symbol,
      receivedFiat: `${fiatValue} USDT`,
      orderAmount: amount,
      orderSymbol: crypto.symbol,
      orderFiat: `${fiatValue} USDT`,
      networkLabel: index % 2 === 0 ? 'Base' : undefined,
      currencySymbol: crypto.symbol,
      currencyNetwork: crypto.network,
    };
  });
}
