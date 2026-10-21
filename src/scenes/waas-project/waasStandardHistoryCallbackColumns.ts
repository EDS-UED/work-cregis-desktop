import {
  PAYMENT_ENGINE_CALLBACK_AMOUNT_BUSINESS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_RECEIVER_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
  type PaymentEngineRecordColumnConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/** 标准 WaaS（非订单模式）· 历史回调 4 列：业务类型|回调 URL、接收方、状态、金额|时间。 */
export const WAAS_STANDARD_HISTORY_CALLBACK_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackBusinessTypeUrl',
    labelKey: 'Business Type',
    secondaryLabelKey: 'Callback URL',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_BUSINESS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'callbackReceiver',
    labelKey: 'Receiver',
    minWidth: PAYMENT_ENGINE_CALLBACK_RECEIVER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 2,
  },
  {
    key: 'callbackStatus',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'callbackAmountTime',
    labelKey: 'Amount',
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    align: 'end',
    comboAlignEnd: true,
    displayOrder: 4,
  },
];
