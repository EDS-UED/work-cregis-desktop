import type { PaymentEngineOrderStatus } from '../paymentEngineRecordConfigs';

/** 支付记录 · 订单币种筛选项（法币 + 加密货币，顺序与产品 spec 一致）。 */
export const PAYMENT_RECORD_ORDER_FIAT_CURRENCY_SYMBOLS = [
  'HKD',
  'USD',
  'TWD',
  'AED',
  'SGD',
  'PHP',
  'CNY',
  'GBP',
  'EUR',
  'MYR',
  'BRL',
  'AUD',
  'BGN',
  'DKK',
  'CAD',
  'SEK',
  'CHF',
  'INR',
] as const;

export const PAYMENT_RECORD_ORDER_CRYPTO_CURRENCY_SYMBOLS = [
  'USDT',
  'USDC',
  'BTC',
  'SOL',
  'ETH',
  'TRX',
  'BNB',
] as const;

/** 支付记录 · 支付币种筛选项（symbol-network 展示名）。 */
export const PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS = [
  'USDT-TRC20',
  'USDT-ERC20',
  'USDT-BEP20',
  'USDT-Polygon',
  'USDT-Avalanche-C',
  'USDT-Arbitrum One',
  'USDT-Solana',
  'USDC-Base',
  'USDC-ERC20',
  'USDC-Solana',
  'USDC-BEP20',
  'USDC-Polygon',
  'USDC-Avalanche-C',
  'USDC-Arbitrum One',
  'USDC-Optimism',
  'Bitcoin',
  'Solana',
  'Ethereum',
  'Base',
  'Arbitrum One',
  'Optimism',
  'TRON',
  'BNB-BSC',
] as const;

/** 支付记录 · 订单状态筛选项顺序（与列表 showcase 一致）。 */
export const PAYMENT_RECORD_ORDER_STATUS_SEQUENCE = [
  'initiated',
  'additional-payment-required',
  'paid',
  'transferred',
  'cancelled',
  'expired',
] as const satisfies readonly PaymentEngineOrderStatus[];

/** 支付记录 · 结算状态筛选项 labelKey（多选）。 */
export const PAYMENT_RECORD_SETTLEMENT_STATUS_LABEL_KEYS = ['Settling', 'Settled'] as const;
