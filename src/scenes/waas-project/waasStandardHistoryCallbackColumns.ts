import {
  PAYMENT_ENGINE_CALLBACK_ADDRESS_TIME_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_AMOUNT_BUSINESS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_RECEIVER_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
  type PaymentEngineRecordColumnConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/** 标准 WaaS（非订单模式）· 历史回调 4 列；支付引擎 / 订单模式仍用 HISTORY_CALLBACK_COLUMNS。 */
export const WAAS_STANDARD_HISTORY_CALLBACK_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackAmountBusinessType',
    labelKey: 'Amount',
    secondaryLabelKey: 'Business Type',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_BUSINESS_COLUMN_MIN_WIDTH,
    flexGrow: false,
    headerKind: 'combo',
    sortable: true,
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
    key: 'callbackAddressTime',
    labelKey: 'Callback URL',
    secondaryLabelKey: 'Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_ADDRESS_TIME_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    comboAlignEnd: true,
    secondarySortable: true,
    align: 'end',
    displayOrder: 4,
  },
];
