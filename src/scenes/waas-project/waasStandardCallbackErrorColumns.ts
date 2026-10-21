import {
  PAYMENT_ENGINE_CALLBACK_ACTIONS_COLUMN_MIN_WIDTH,
  type PaymentEngineRecordColumnConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/**
 * 标准 WaaS · 异常回调 5 列 min-width（EgDataList `useResponsiveColumns`）：
 * 首列 + 尾列（操作）恒显；中间列仅当 Σ min + 80px reserve ≤ 容器宽才加入。
 * 批选列再占 40px。1280 预览列表区 ≈807px 预算 → 五列 Σ min 须 ≤807（批选时 ≤767）。
 */
const WAAS_STANDARD_CALLBACK_ERROR_BUSINESS_ADDRESS_COLUMN_MIN_WIDTH = '96px';
const WAAS_STANDARD_CALLBACK_ERROR_SENDER_COLUMN_MIN_WIDTH = '144px';
const WAAS_STANDARD_CALLBACK_ERROR_RECEIVER_COLUMN_MIN_WIDTH = '144px';
/** 金额|时间：min 收紧，剩余宽度由发送方 flex 吸收；单元格内溢出走 HashLike tooltip。 */
const WAAS_STANDARD_CALLBACK_ERROR_AMOUNT_TIME_COLUMN_MIN_WIDTH = '192px';

/** 标准 WaaS（非订单模式）· 异常回调 5 列：业务类型|回调地址、发送方、接收方、金额|时间、操作。 */
export const WAAS_STANDARD_CALLBACK_ERROR_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackBusinessTypeAddress',
    labelKey: 'Business Type',
    secondaryLabelKey: 'Callback Address',
    minWidth: WAAS_STANDARD_CALLBACK_ERROR_BUSINESS_ADDRESS_COLUMN_MIN_WIDTH,
    flexGrow: false,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'callbackSender',
    labelKey: 'Sender',
    minWidth: WAAS_STANDARD_CALLBACK_ERROR_SENDER_COLUMN_MIN_WIDTH,
    flexGrow: true,
    displayOrder: 2,
  },
  {
    key: 'callbackReceiver',
    labelKey: 'Receiver',
    minWidth: WAAS_STANDARD_CALLBACK_ERROR_RECEIVER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 3,
  },
  {
    key: 'callbackAmountTime',
    labelKey: 'Amount',
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: WAAS_STANDARD_CALLBACK_ERROR_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    flexGrow: false,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 4,
  },
  {
    key: 'callbackActions',
    labelKey: 'Actions',
    minWidth: PAYMENT_ENGINE_CALLBACK_ACTIONS_COLUMN_MIN_WIDTH,
    flexGrow: false,
    align: 'end',
    displayOrder: 5,
  },
];
