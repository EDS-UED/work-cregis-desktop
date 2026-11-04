import {
  WALLET_PAYOUT_CALLBACK_RECEIVER_COLUMN,
  WALLET_PAYOUT_CALLBACK_SENDER_COLUMN,
  WALLET_PAYOUT_STATUS_COLUMN_MIN_WIDTH,
  type PaymentEngineRecordColumnConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/** 历史记录 · 交易类型|哈希 min（192 − 60）。 */
const WAAS_TRANSACTION_HISTORY_TYPE_HASH_COLUMN_MIN_WIDTH = '132px';
/** 历史记录 · 金额|交易时间 min（198 + 40）。 */
const WAAS_TRANSACTION_HISTORY_AMOUNT_TIME_COLUMN_MIN_WIDTH = '238px';
/** 历史记录 · 发送方/接收方 min（199 − 20）。 */
const WAAS_TRANSACTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH = '179px';

/**
 * 标准 WaaS · 历史记录 5 列：交易类型|交易哈希、发送方、接收方、状态、金额|交易时间。
 * 仅首、尾 combo 列 flex；发送方/接收方锁定 min。
 */
export const WAAS_TRANSACTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'transactionTypeTxHash',
    labelKey: 'Transaction Type',
    secondaryLabelKey: 'Transaction hash',
    minWidth: WAAS_TRANSACTION_HISTORY_TYPE_HASH_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    flexGrow: true,
    displayOrder: 1,
  },
  {
    ...WALLET_PAYOUT_CALLBACK_SENDER_COLUMN,
    minWidth: WAAS_TRANSACTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH,
    displayOrder: 2,
    flexGrow: false,
  },
  {
    ...WALLET_PAYOUT_CALLBACK_RECEIVER_COLUMN,
    minWidth: WAAS_TRANSACTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH,
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: WALLET_PAYOUT_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    flexGrow: false,
    displayOrder: 4,
  },
  {
    key: 'callbackAmountTime',
    labelKey: 'Amount',
    secondaryLabelKey: 'Transaction Time UTC+08:00',
    minWidth: WAAS_TRANSACTION_HISTORY_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    align: 'end',
    comboAlignEnd: true,
    displayOrder: 5,
  },
];

/** 处理中 · 与历史记录同表，无状态列（列表语境即处理中）。 */
export const WAAS_TRANSACTION_PROCESSING_COLUMNS: PaymentEngineRecordColumnConfig[] =
  WAAS_TRANSACTION_HISTORY_COLUMNS.filter((column) => column.key !== 'bulkState').map(
    (column) =>
      column.key === 'callbackAmountTime' ? { ...column, displayOrder: 4 } : column,
  );
