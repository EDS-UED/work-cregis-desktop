export const PAYMENT_ENGINE_MENU_ITEMS = [
  'Order Record',
  'Settlement Record',
  'Payment Exception Record',
  'Callback Record',
  'Settings',
] as const;

export type PaymentEngineMenuItem = (typeof PAYMENT_ENGINE_MENU_ITEMS)[number];

export function isPaymentEngineMenuItem(label: string): label is PaymentEngineMenuItem {
  return (PAYMENT_ENGINE_MENU_ITEMS as readonly string[]).includes(label);
}

export const DEFAULT_PAYMENT_ENGINE_MENU_ITEM: PaymentEngineMenuItem = 'Order Record';

export type PaymentEngineListKind =
  | 'Order Record'
  | 'Settlement Record'
  | 'Payment Exception Record'
  | 'Callback Record';

export function isPaymentEngineListKind(label: string): label is PaymentEngineListKind {
  return (
    label === 'Order Record' ||
    label === 'Settlement Record' ||
    label === 'Payment Exception Record' ||
    label === 'Callback Record'
  );
}

export type OrderStatus =
  | 'New'
  | 'Overpaid'
  | 'Underpaid'
  | 'Expired'
  | 'Canceled'
  | 'Paid'
  | 'Completed';

export type OrderDetailVariant = 'order' | 'topup' | 'refund' | 'settlement';

export type OrderRecordRow = {
  id: string;
  orderId: string;
  merchantOrderId: string;
  status: OrderStatus;
  createdAt: string;
  receivedAmount: string;
  receivedSymbol: string;
  orderAmount: string;
  chainTag?: string;
  detailVariant: OrderDetailVariant;
};

export type SettlementStatus = 'Settling' | 'Settled';

export type SettlementRecordRow = {
  id: string;
  token: string;
  networkTag?: string;
  address: string;
  status: SettlementStatus;
  createdAt: string;
  settlementNumber: string;
  receivedAmount: string;
  receivedSymbol: string;
  settledAmount: string;
  chainTag?: string;
};

export type ExceptionStatus = 'Pending' | 'Transferred';

export type ExceptionRecordRow = {
  id: string;
  token: string;
  networkTag?: string;
  fromAddress: string;
  toAddress: string;
  status: ExceptionStatus;
  receivedAt: string;
  amount: string;
};

export type CallbackStatus = 'Success' | 'Failed';

export type CallbackRecordRow = {
  id: string;
  orderId: string;
  merchantOrderId: string;
  status: CallbackStatus;
  event: string;
  callbackAt: string;
};

const ORDER_TIME = '2032-10-23  12:22:54';
const SETTLEMENT_TIME = '2027-10-23  12:22:54';
const EXCEPTION_TIME = '2032-10-23  12:22:54';
const CALLBACK_TIME = '2032-10-23  12:22:54';

export const ORDER_RECORDS: OrderRecordRow[] = [
  {
    id: 'order-1',
    orderId: 'po1442856738070528',
    merchantOrderId: '897bfc89f49640cca5553ad26883c612',
    status: 'New',
    createdAt: ORDER_TIME,
    receivedAmount: '5,000',
    receivedSymbol: 'ZEC',
    orderAmount: '5,000 USD',
    detailVariant: 'order',
  },
  {
    id: 'order-2',
    orderId: '- -',
    merchantOrderId: '897bfc89f49640cca5553ad26883c613',
    status: 'Overpaid',
    createdAt: ORDER_TIME,
    receivedAmount: '0.0699',
    receivedSymbol: 'USDT',
    orderAmount: '0.07 USD',
    chainTag: 'Base',
    detailVariant: 'topup',
  },
  {
    id: 'order-3',
    orderId: 'po1442856738070530',
    merchantOrderId: '897bfc89f49640cca5553ad26883c614',
    status: 'Underpaid',
    createdAt: ORDER_TIME,
    receivedAmount: '6.7668',
    receivedSymbol: 'USDT',
    orderAmount: '2 USD',
    detailVariant: 'topup',
  },
  {
    id: 'order-4',
    orderId: 'po1442856738070531',
    merchantOrderId: '897bfc89f49640cca5553ad26883c615',
    status: 'Expired',
    createdAt: ORDER_TIME,
    receivedAmount: '61282.9627',
    receivedSymbol: 'TRX',
    orderAmount: '18,112.82 USD',
    detailVariant: 'order',
  },
  {
    id: 'order-5',
    orderId: 'po1442856738070532',
    merchantOrderId: '897bfc89f49640cca5553ad26883c616',
    status: 'Canceled',
    createdAt: ORDER_TIME,
    receivedAmount: '0.0091',
    receivedSymbol: 'ETH',
    orderAmount: '36 USD',
    detailVariant: 'order',
  },
  {
    id: 'order-6',
    orderId: 'po1442856738070533',
    merchantOrderId: '897bfc89f49640cca5553ad26883c617',
    status: 'Paid',
    createdAt: ORDER_TIME,
    receivedAmount: '0.7632',
    receivedSymbol: 'ETH',
    orderAmount: '3,000 USD',
    detailVariant: 'order',
  },
  {
    id: 'order-7',
    orderId: '- -',
    merchantOrderId: '897bfc89f49640cca5553ad26883c618',
    status: 'Completed',
    createdAt: ORDER_TIME,
    receivedAmount: '102,295',
    receivedSymbol: 'HYPE',
    orderAmount: '102,295 USD',
    chainTag: 'Base',
    detailVariant: 'settlement',
  },
  {
    id: 'order-8',
    orderId: 'po1442856738070535',
    merchantOrderId: '897bfc89f49640cca5553ad26883c619',
    status: 'Completed',
    createdAt: ORDER_TIME,
    receivedAmount: '0.07180',
    receivedSymbol: 'BTC',
    orderAmount: '8,000 USD',
    detailVariant: 'refund',
  },
];

export const SETTLEMENT_RECORDS: SettlementRecordRow[] = [
  {
    id: 'settle-1',
    token: 'USDT',
    networkTag: 'BNB Smart Chain',
    address: '0xf30ba13e4b04ce5dc4d254ae5fa95477800f0eb0',
    status: 'Settling',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070528',
    receivedAmount: '5,000',
    receivedSymbol: 'HYPE',
    settledAmount: '195,373.26 USDT',
  },
  {
    id: 'settle-2',
    token: 'TON',
    address: 'EQDEbUV-6d9uDe1N7e0mEgHnYSQ_CLrd6-WFXaa38aCSgE3S',
    status: 'Settling',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070529',
    receivedAmount: '0.0699',
    receivedSymbol: 'HYPE',
    settledAmount: '2.73 USDT',
    chainTag: 'Base',
  },
  {
    id: 'settle-3',
    token: 'ZEC',
    address: 't1V1n6DpPxWgG8QhKxFjHtLmXzYcXaCb2Z',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070530',
    receivedAmount: '6.7668',
    receivedSymbol: 'HYPE',
    settledAmount: '264.41 USDT',
  },
  {
    id: 'settle-4',
    token: 'AAVE',
    networkTag: 'Base',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070531',
    receivedAmount: '61282.9627',
    receivedSymbol: 'HYPE',
    settledAmount: '2,395,373.18 USDT',
  },
  {
    id: 'settle-5',
    token: 'MNT',
    networkTag: 'Solana',
    address: '0x3c3a81e81dc49A522A592e7622A7E711c06bf354',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070532',
    receivedAmount: '0.0091',
    receivedSymbol: 'HYPE',
    settledAmount: '0.3556 USDT',
  },
  {
    id: 'settle-6',
    token: 'BGB',
    address: '0x54D2252757e1672EEaD234D27B1270728fF90581',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070533',
    receivedAmount: '0.7632',
    receivedSymbol: 'HYPE',
    settledAmount: '29.82 USDT',
  },
  {
    id: 'settle-7',
    token: '1INCH',
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070534',
    receivedAmount: '102,295',
    receivedSymbol: 'HYPE',
    settledAmount: '3,997,141.63 USD',
    chainTag: 'Base',
  },
  {
    id: 'settle-8',
    token: 'DEEP',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    status: 'Settled',
    createdAt: SETTLEMENT_TIME,
    settlementNumber: 'po1442856738070535',
    receivedAmount: '0.07180',
    receivedSymbol: 'HYPE',
    settledAmount: '2.81 USDT',
  },
];

export const EXCEPTION_RECORDS: ExceptionRecordRow[] = [
  {
    id: 'ex-1',
    token: 'USDT',
    networkTag: 'BNB Smart Chain',
    fromAddress: '0x55e8...d31c38',
    toAddress: '0x8de1...e1fe01',
    status: 'Pending',
    receivedAt: EXCEPTION_TIME,
    amount: '100,000,000',
  },
  {
    id: 'ex-2',
    token: 'TON',
    fromAddress: 'EQCI2s...Cjh0bs',
    toAddress: 'EQDEbU...SgE3S',
    status: 'Pending',
    receivedAt: EXCEPTION_TIME,
    amount: '0.07782',
  },
  {
    id: 'ex-3',
    token: 'ZEC',
    fromAddress: 't1V1n6...XaCb2Z',
    toAddress: 't1P9sK...LmXzYc',
    status: 'Pending',
    receivedAt: EXCEPTION_TIME,
    amount: '2.000062',
  },
  {
    id: 'ex-4',
    token: 'AAVE',
    networkTag: 'Base',
    fromAddress: '0x7Fc6...2DDaE9',
    toAddress: '0x8de1...e1fe01',
    status: 'Pending',
    receivedAt: EXCEPTION_TIME,
    amount: '18,112.82',
  },
  {
    id: 'ex-5',
    token: 'MNT',
    networkTag: 'Solana',
    fromAddress: '0x3c3a...6bf354',
    toAddress: '0x54D2...F90581',
    status: 'Pending',
    receivedAt: EXCEPTION_TIME,
    amount: '3,605,298.721',
  },
  {
    id: 'ex-6',
    token: 'BGB',
    fromAddress: '0x54D2...F90581',
    toAddress: 'Gate. Withdraw',
    status: 'Transferred',
    receivedAt: EXCEPTION_TIME,
    amount: '3,082.7192',
  },
  {
    id: 'ex-7',
    token: '1INCH',
    fromAddress: '0x1111...20c302',
    toAddress: '0x8de1...e1fe01',
    status: 'Transferred',
    receivedAt: EXCEPTION_TIME,
    amount: '102,295',
  },
  {
    id: 'ex-8',
    token: 'ETH',
    fromAddress: '0xeeee...eeeeee',
    toAddress: '0x8de1...e1fe01',
    status: 'Transferred',
    receivedAt: EXCEPTION_TIME,
    amount: '0.07180',
  },
];

export const CALLBACK_RECORDS: CallbackRecordRow[] = [
  {
    id: 'cb-1',
    orderId: 'po1442856738070528',
    merchantOrderId: '897bfc89f49640cca5553ad26883c612',
    status: 'Failed',
    event: 'Payment',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-2',
    orderId: 'po1442856738070530',
    merchantOrderId: '897bfc89f49640cca5553ad26883c614',
    status: 'Failed',
    event: 'Payment',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-3',
    orderId: 'po1442856738070531',
    merchantOrderId: '897bfc89f49640cca5553ad26883c615',
    status: 'Success',
    event: 'Refund',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-4',
    orderId: 'po1442856738070532',
    merchantOrderId: '897bfc89f49640cca5553ad26883c616',
    status: 'Success',
    event: 'Payment',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-5',
    orderId: 'po1442856738070533',
    merchantOrderId: '897bfc89f49640cca5553ad26883c617',
    status: 'Success',
    event: 'Settlement',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-6',
    orderId: '- -',
    merchantOrderId: '897bfc89f49640cca5553ad26883c618',
    status: 'Success',
    event: 'Payment',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-7',
    orderId: 'po1442856738070535',
    merchantOrderId: '897bfc89f49640cca5553ad26883c619',
    status: 'Success',
    event: 'Refund',
    callbackAt: CALLBACK_TIME,
  },
  {
    id: 'cb-8',
    orderId: 'po1442856738070536',
    merchantOrderId: '897bfc89f49640cca5553ad26883c620',
    status: 'Success',
    event: 'Payment',
    callbackAt: CALLBACK_TIME,
  },
];

export const PAYMENT_ENGINE_PAGINER_STATS = [
  { text: 'Total Actual Received Amount', number: '500K HYPE' },
  { text: 'Total Transaction Fee', number: '0.0699 HYPE' },
  { text: 'Total Settled Amount', number: '20.55M HYPE' },
];
