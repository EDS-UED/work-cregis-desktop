import type { PaymentEngineRecordMenuItem } from './paymentEngineMenuData';

export type PaymentEngineOrderStatus =
  | 'initiated'
  | 'additional-payment-required'
  | 'expired'
  | 'cancelled'
  | 'paid'
  | 'transferred'
  | 'pending'
  | 'success'
  | 'failed';

export type PaymentEngineRecordRow = {
  id: string;
  merchantOrderId: string;
  status: PaymentEngineOrderStatus;
  createdAt: string;
  receivedAmount: string;
  receivedSymbol: string;
  receivedFiat?: string;
  orderAmount: string;
  orderSymbol: string;
  orderFiat?: string;
  networkLabel?: string;
  currencySymbol?: string;
  currencyNetwork?: string;
  bulkTransferId?: string;
  refundId?: string;
};

export type PaymentEngineRecordColumnKey =
  | 'orderIds'
  | 'status'
  | 'createdAt'
  | 'receivedAmount'
  | 'orderAmount'
  | 'crypto'
  | 'bulkState'
  | 'bulkMeta'
  | 'bulkAmount'
  | 'refundState'
  | 'refundMeta'
  | 'refundAmount';

export type PaymentEngineColumnAlign = 'start' | 'center' | 'end';

export type PaymentEngineRecordColumnConfig = {
  key: PaymentEngineRecordColumnKey;
  labelKey: string;
  secondaryLabelKey?: string;
  minWidth: string;
  flexGrow?: boolean;
  align?: PaymentEngineColumnAlign;
  headerKind?: 'plain' | 'combo';
  comboAlignEnd?: boolean;
  sortable?: boolean;
  secondarySortable?: boolean;
};

export type PaymentEngineRecordPageConfig = {
  showExport: boolean;
  filterBadge?: number;
  columns: PaymentEngineRecordColumnConfig[];
  statistics?: Array<{ labelKey: string; value: string }>;
};

const ORDER_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'orderIds',
    labelKey: 'Order ID',
    secondaryLabelKey: 'Merchant Order ID',
    minWidth: '207px',
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
  },
  {
    key: 'status',
    labelKey: 'Order Status',
    minWidth: '248px',
    align: 'center',
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time',
    minWidth: '188px',
    sortable: true,
  },
  {
    key: 'receivedAmount',
    labelKey: 'Actual Received Amount',
    minWidth: '220px',
    flexGrow: true,
    align: 'end',
    sortable: true,
  },
  {
    key: 'orderAmount',
    labelKey: 'Order Amount',
    minWidth: '220px',
    flexGrow: true,
    align: 'end',
    sortable: true,
  },
];

const BULK_TRANSFER_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  { key: 'crypto', labelKey: 'Token', minWidth: '250px' },
  {
    key: 'bulkState',
    labelKey: 'Bulk Transfer State',
    minWidth: '237px',
    align: 'center',
  },
  {
    key: 'bulkMeta',
    labelKey: 'Bulk Transfer Time',
    secondaryLabelKey: 'Bulk Transfer ID',
    minWidth: '280px',
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Bulk Transfer Amount',
    minWidth: '200px',
    align: 'end',
    sortable: true,
  },
];

const REFUND_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  { key: 'crypto', labelKey: 'Token', minWidth: '252px' },
  {
    key: 'refundState',
    labelKey: 'Refund State',
    minWidth: '152px',
    align: 'center',
  },
  {
    key: 'refundMeta',
    labelKey: 'Refund Time',
    secondaryLabelKey: 'Refund ID',
    minWidth: '281px',
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
  },
  {
    key: 'refundAmount',
    labelKey: 'Refund Amount',
    minWidth: '281px',
    align: 'end',
    sortable: true,
  },
];

const WALLET_PAYOUT_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  { key: 'crypto', labelKey: 'Token', minWidth: '250px' },
  {
    key: 'bulkState',
    labelKey: 'Wallet Payout State',
    minWidth: '237px',
    align: 'center',
  },
  {
    key: 'bulkMeta',
    labelKey: 'Wallet Payout Time',
    secondaryLabelKey: 'Wallet Payout ID',
    minWidth: '280px',
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Wallet Payout Amount',
    minWidth: '200px',
    align: 'end',
    sortable: true,
  },
];

export const PAYMENT_ENGINE_RECORD_PAGE_CONFIG: Record<
  PaymentEngineRecordMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Order Record': {
    showExport: true,
    filterBadge: 3,
    columns: ORDER_RECORD_COLUMNS,
    statistics: [
      { labelKey: 'Partial Paid', value: '2,500 HYPE' },
      { labelKey: 'Paid', value: '330 HYPE' },
      { labelKey: 'Transferred', value: '20.55 HYPE' },
    ],
  },
  'Bulk Transfer Record': {
    showExport: true,
    filterBadge: 1,
    columns: BULK_TRANSFER_COLUMNS,
  },
  'Refund Record': {
    showExport: true,
    columns: REFUND_COLUMNS,
  },
  'Payment Exception Record': {
    showExport: false,
    columns: ORDER_RECORD_COLUMNS,
  },
  'Wallet Payout': {
    showExport: true,
    filterBadge: 1,
    columns: WALLET_PAYOUT_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    columns: ORDER_RECORD_COLUMNS,
  },
  'History Callback': {
    showExport: true,
    columns: ORDER_RECORD_COLUMNS,
  },
};

export function resolvePaymentEngineRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    PAYMENT_ENGINE_RECORD_PAGE_CONFIG[menuItem as PaymentEngineRecordMenuItem] ??
    PAYMENT_ENGINE_RECORD_PAGE_CONFIG['Order Record']
  );
}
