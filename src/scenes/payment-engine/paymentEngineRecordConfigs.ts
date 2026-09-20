import type { TagStatus } from '@eds/desktop-components';
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
  | 'failed'
  | 'external-pending'
  | 'approving'
  | 'signature-pending'
  | 'signed-pending-confirmation'
  | 'completed'
  | 'transaction-failed'
  | 'rejected';

export type PaymentEngineCallbackEventType =
  | 'wallet-payout'
  | 'waas-order'
  | 'payment-exception'
  | 'waas-refund';
export type PaymentEngineCallbackTriggerMode = 'auto' | 'manual';
export type PaymentEngineCallbackStatus = 'ignore' | 'normal';

/** 订单记录 · 支付信息 Tab 单笔支付分区。 */
export type PaymentEngineOrderPaymentSectionKind = 'first' | 'additional';

export type PaymentEngineOrderPaymentRecord = {
  kind: PaymentEngineOrderPaymentSectionKind;
  paymentId: string;
  paymentWallet: string;
  amount: string;
  symbol: string;
  networkLabel?: string;
  blockTimestamp: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  txHash: string;
};

export type PaymentEngineOrderRefundStatus = 'pending' | 'success' | 'failed';

export type PaymentEngineOrderRefundRecord = {
  refundId: string;
  status: PaymentEngineOrderRefundStatus;
  refundTypeKey: 'Partial refund' | 'Full refund';
  refundReasonKey?: string;
  payerId: string;
  createdAt: string;
  blockTimestamp: string;
  approvalTime?: string;
  initiatedBy?: string;
  remark?: string;
  /** 退款完成时展示。 */
  blockEvent?: string;
  /** 退款完成时展示。 */
  txHash?: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  refundAmount: string;
  refundSymbol: string;
  networkLabel?: string;
  refundFee: string;
  actualRefundAmount: string;
};

export type PaymentEngineOrderBulkTransferStatus = 'pending' | 'success' | 'failed';

export type PaymentEngineOrderBulkTransferRecord = {
  bulkTransferId: string;
  status: PaymentEngineOrderBulkTransferStatus;
  transferAddress: string;
  createdAt: string;
  transferredAmount: string;
  transferredSymbol: string;
  networkLabel?: string;
  serviceFee: string;
  serviceFeeDeductedFromKey: 'Team Account Balance';
};

/** 批量转账详情页 · 转账记录子表行。 */
export type PaymentEngineBulkTransferLineRecord = {
  transferId: string;
  amount: string;
  symbol: string;
  networkLabel?: string;
  txHash: string;
  senderAddress: string;
  status: PaymentEngineOrderBulkTransferStatus;
  blockTimestamp: string;
};

export type PaymentEngineBulkTransferDetailRecord = {
  recipientAddress: string;
  transferLines: PaymentEngineBulkTransferLineRecord[];
};

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
  currencyShowNetwork?: boolean;
  currencyCryptoName?: string;
  bulkTransferId?: string;
  refundId?: string;
  walletFromAddress?: string;
  walletFromAlias?: string;
  walletToAddress?: string;
  walletToAlias?: string;
  callbackEventType?: PaymentEngineCallbackEventType;
  callbackTriggerMode?: PaymentEngineCallbackTriggerMode;
  callbackEventId?: string;
  callbackUrl?: string;
  callbackStatus?: PaymentEngineCallbackStatus;
  /** 订单详情 · 汇率（由订单 mock 派生）。 */
  exchangeRate?: string;
  /** 订单详情 · 支付信息 Tab 分区列表。 */
  orderPayments?: PaymentEngineOrderPaymentRecord[];
  /** 已转账且发生退款时展示第三 Tab。 */
  orderRefund?: PaymentEngineOrderRefundRecord;
  /** 已转账且走批量转账时展示第三 Tab。 */
  orderBulkTransfer?: PaymentEngineOrderBulkTransferRecord;
  /** 批量转账记录列表 · 整页详情派生数据。 */
  bulkTransferDetail?: PaymentEngineBulkTransferDetailRecord;
  /** 退款记录列表 · 详情 Popup 派生数据。 */
  refundRecordDetail?: PaymentEngineOrderRefundRecord;
  /** 异常支付单记录列表 · 详情 Popup 派生数据。 */
  paymentExceptionRecordDetail?: PaymentEnginePaymentExceptionDetailRecord;
  /** 异常回调列表 · 详情 Popup 派生数据。 */
  callbackErrorRecordDetail?: PaymentEngineCallbackErrorDetailRecord;
  /** 支付记录列表 · 详情 Popup 派生数据。 */
  settlementRecordDetail?: PaymentEngineSettlementRecordDetail;
  /** WaaS 规则配置 · 规则名。 */
  ruleName?: string;
  /** WaaS 规则配置 · 编号。 */
  ruleNumber?: string;
  /** WaaS 规则配置 · 金额区间 i18n key 或展示文案。 */
  collectionAmountRangeKey?: string;
  /** WaaS 规则配置 · 启用开关。 */
  ruleEnabled?: boolean;
  /** WaaS 任务记录 · 开始时间。 */
  taskStartAt?: string;
  /** WaaS 任务记录 · 结束时间。 */
  taskEndAt?: string;
  /** WaaS 任务记录 · 笔数。 */
  taskTransactionCount?: string;
  /** WaaS 归集记录 · 归集编号。 */
  collectionId?: string;
  /** WaaS 归集历史 · 完成时间。 */
  completionTime?: string;
};

export type PaymentEngineSettlementRecordDetail = {
  successfulPaymentCount: string;
  totalTransactionAmount: string;
  totalTransactionSymbol: string;
  totalFee: string;
  totalFeeSymbol: string;
  settlementAddress: string;
};

export type PaymentEngineCallbackErrorDetailRecord = {
  callbackRecordId: string;
  callbackUrl: string;
  updateTime: string;
  /** 异常回调 · 回调 Tab 原始错误文案（不走 i18n）。 */
  abnormalReason?: string;
  filteredReasonKey?: string;
  orderId: string;
  merchantOrderId: string;
  callbackEventStatus: PaymentEngineOrderStatus;
  callbackEventStatusLabelKey?: string;
  callbackEventStatusTagStatus?: TagStatus;
  txHash?: string;
  walletType?: string;
  payoutId?: string;
  thirdPartyBusinessNo?: string;
  transStatus?: PaymentEngineOrderStatus;
  senderAddress?: string;
  receiverAddress?: string;
  receiverAlias?: string;
  remark?: string;
};

export type PaymentEnginePaymentExceptionTransferApprovalStatus =
  | 'refunding'
  | 'transferred'
  | 'failed';

export type PaymentEnginePaymentExceptionDetailRecord = {
  exceptionId: string;
  filteredReasonKey: string;
  transferApprovalStatus: PaymentEnginePaymentExceptionTransferApprovalStatus;
  initiatedBy?: string;
  createdAt: string;
  blockTimestamp: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  transferSymbol: string;
  networkLabel?: string;
  transferFee: string;
  actualTransferredAmount: string;
  txHash?: string;
  remark?: string;
};

export type PaymentEngineRecordColumnKey =
  | 'orderIds'
  | 'settlementNumber'
  | 'status'
  | 'createdAt'
  | 'receivedAmount'
  | 'orderAmount'
  | 'orderAmounts'
  | 'crypto'
  | 'bulkState'
  | 'bulkMeta'
  | 'bulkAmount'
  | 'refundState'
  | 'refundMeta'
  | 'refundAmount'
  | 'callbackEvent'
  | 'callbackAmount'
  | 'callbackStatus'
  | 'callbackTime'
  | 'callbackUrl'
  | 'ruleNameId'
  | 'collectionCurrencyRange'
  | 'ruleEnabled'
  | 'ruleActions'
  | 'taskCurrencyId'
  | 'taskStatus'
  | 'taskDateRange'
  | 'taskAmount'
  | 'taskCount'
  | 'collectionHistoryMeta';

export type PaymentEngineDataListToolbarPreset =
  | 'default'
  | 'filter-refresh'
  | 'batch-filter-refresh'
  | 'rule-configuration';

export type PaymentEngineColumnAlign = 'start' | 'center' | 'end';

export type PaymentEngineRecordColumnConfig = {
  key: PaymentEngineRecordColumnKey;
  labelKey: string;
  secondaryLabelKey?: string;
  minWidth: string;
  /** 固定列宽（不参与 EDS leading flex 均分）；与 minWidth 同值时列锁定不伸缩。 */
  width?: string;
  flexGrow?: boolean;
  align?: PaymentEngineColumnAlign;
  headerKind?: 'plain' | 'combo';
  comboAlignEnd?: boolean;
  sortable?: boolean;
  secondarySortable?: boolean;
  /** display-order 越小越优先保留（响应式缩列时）。 */
  displayOrder?: number;
};

export type PaymentEngineRecordPageConfig = {
  showExport: boolean;
  filterBadge?: number;
  showBatchSelect?: boolean;
  rowCount?: number;
  toolbarPreset?: PaymentEngineDataListToolbarPreset;
  columns: PaymentEngineRecordColumnConfig[];
  statistics?: Array<{ labelKey: string; value: string }>;
};

/**
 * 订单记录 DataList 列 min-width（§7.7 仅经 EgDataListColumn 传入）。
 * 1280 预览下 DataList 预算约 887px（容器宽 − 80px reserve）；Σ min 控制在 875px 留余量，避免中间列被响应式隐藏。
 * 基准 Figma：145 / 248 / 170 / 324；首列加宽 +35px 后，其余三列按份额回拨。
 */
export const PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH = '180px';
export const PAYMENT_ENGINE_ORDER_RECORD_STATUS_COLUMN_MIN_WIDTH = '240px';
/** 单行 `YYYY-MM-DD HH:MM:SS`（body-medium tabular）+ 表头 `UTC+08:00` 后缀。 */
export const PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH = '176px';
/** flex 列吸收余量；尾列承担主要回拨。 */
export const PAYMENT_ENGINE_ORDER_RECORD_ORDER_AMOUNTS_COLUMN_MIN_WIDTH = '279px';

const ORDER_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'orderIds',
    labelKey: 'Order ID',
    secondaryLabelKey: 'Merchant Order ID',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
    displayOrder: 1,
  },
  {
    key: 'status',
    labelKey: 'Order Status',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 3,
  },
  {
    key: 'orderAmounts',
    labelKey: 'Actual Received Amount',
    secondaryLabelKey: 'Order Amount',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_AMOUNTS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    headerKind: 'combo',
    comboAlignEnd: true,
    sortable: true,
    secondarySortable: true,
    displayOrder: 4,
  },
];

/**
 * 批量转账 / 钱包出款 / 异常支付单 Token|Address 列 min-width（§7.7）。
 * 首列 width=min 锁定、不参与 flex；双地址行需略宽于仅币种列。
 * Σ min（批量转账四列）779px + display-order，1280 预览预算约 887px。
 */
export const PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH = '288px';
export const PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH = '145px';
export const PAYMENT_ENGINE_BULK_TRANSFER_META_COLUMN_MIN_WIDTH = '248px';
export const PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH = '170px';

/** 退款记录 DataList 列 min-width（§7.7；Σ min 753px + display-order；网络 Tag 溢出由 EDS CryptoCombo 省略）。 */
export const PAYMENT_ENGINE_REFUND_TOKEN_COLUMN_MIN_WIDTH = '145px';
export const PAYMENT_ENGINE_REFUND_STATUS_COLUMN_MIN_WIDTH = '160px';
export const PAYMENT_ENGINE_REFUND_META_COLUMN_MIN_WIDTH = '248px';
export const PAYMENT_ENGINE_REFUND_AMOUNT_COLUMN_MIN_WIDTH = '200px';

/** 历史回调 DataList 列 min-width。 */
export const PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH = '244px';
export const PAYMENT_ENGINE_CALLBACK_AMOUNT_COLUMN_MIN_WIDTH = '260px';
export const PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH = '120px';
export const PAYMENT_ENGINE_CALLBACK_TIME_COLUMN_MIN_WIDTH =
  PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH;
export const PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH = '160px';

const SETTLEMENT_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'settlementNumber',
    labelKey: 'Settlement ID',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'status',
    labelKey: 'Settlement Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Settlement Time',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 3,
  },
  {
    key: 'orderAmounts',
    labelKey: 'Actual Received Amount',
    secondaryLabelKey: 'Order Amount',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_AMOUNTS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    headerKind: 'combo',
    comboAlignEnd: true,
    sortable: true,
    secondarySortable: true,
    displayOrder: 4,
  },
];

const BULK_TRANSFER_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Token',
    secondaryLabelKey: 'Address',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 3,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

const REFUND_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Token',
    minWidth: PAYMENT_ENGINE_REFUND_TOKEN_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_REFUND_TOKEN_COLUMN_MIN_WIDTH,
    displayOrder: 1,
  },
  {
    key: 'refundState',
    labelKey: 'Refund State',
    minWidth: PAYMENT_ENGINE_REFUND_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'refundMeta',
    labelKey: 'Creation Time UTC+08:00',
    secondaryLabelKey: 'Order ID',
    minWidth: PAYMENT_ENGINE_REFUND_META_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
    displayOrder: 3,
  },
  {
    key: 'refundAmount',
    labelKey: 'Refund Amount',
    minWidth: PAYMENT_ENGINE_REFUND_AMOUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

/** 异常支付单：Token|Address + 状态 + 时间 + 金额（Figma 4 列；Σ min 779px）。 */
const PAYMENT_EXCEPTION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Token',
    secondaryLabelKey: 'Address',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 3,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

const WALLET_PAYOUT_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Token',
    secondaryLabelKey: 'Address',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 3,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

const HISTORY_CALLBACK_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackEvent',
    labelKey: 'Callback Event',
    secondaryLabelKey: 'Callback Event ID',
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
  },
  {
    key: 'callbackAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_COLUMN_MIN_WIDTH,
    sortable: true,
  },
  {
    key: 'callbackStatus',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
  },
  {
    key: 'callbackTime',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
  },
  {
    key: 'callbackUrl',
    labelKey: 'Callback URL',
    minWidth: PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
  },
];

const CALLBACK_ERROR_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackEvent',
    labelKey: 'Callback Event',
    secondaryLabelKey: 'Callback Event ID',
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
  },
  {
    key: 'callbackAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_COLUMN_MIN_WIDTH,
    sortable: true,
  },
  {
    key: 'callbackTime',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
  },
  {
    key: 'callbackUrl',
    labelKey: 'Callback URL',
    minWidth: PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
  },
];

/** WaaS 订单记录 / 支付引擎订单记录共用列表配置（筛选角标 + 统计项）。 */
export const PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG: PaymentEngineRecordPageConfig = {
  showExport: true,
  filterBadge: 3,
  columns: ORDER_RECORD_COLUMNS,
  statistics: [
    { labelKey: 'Partial Paid', value: '2,500 HYPE' },
    { labelKey: 'Paid', value: '330 HYPE' },
    { labelKey: 'Transferred', value: '20.55 HYPE' },
  ],
};

export {
  BULK_TRANSFER_COLUMNS,
  CALLBACK_ERROR_COLUMNS,
  HISTORY_CALLBACK_COLUMNS,
  ORDER_RECORD_COLUMNS,
  PAYMENT_EXCEPTION_COLUMNS,
  REFUND_COLUMNS,
  SETTLEMENT_RECORD_COLUMNS,
  WALLET_PAYOUT_COLUMNS,
};

export const PAYMENT_ENGINE_RECORD_PAGE_CONFIG: Record<
  PaymentEngineRecordMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Payment Record': PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG,
  'Settlement Record': {
    showExport: true,
    columns: SETTLEMENT_RECORD_COLUMNS,
  },
  'Payment Exception Record': {
    showExport: true,
    columns: PAYMENT_EXCEPTION_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    showBatchSelect: true,
    columns: CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    columns: HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolvePaymentEngineRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    PAYMENT_ENGINE_RECORD_PAGE_CONFIG[menuItem as PaymentEngineRecordMenuItem] ??
    PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG
  );
}
