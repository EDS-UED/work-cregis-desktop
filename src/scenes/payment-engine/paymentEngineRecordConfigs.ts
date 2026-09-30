import type { TagColorfulStyle, TagStatus } from '@eds/desktop-components';
import type { DetailProgressMemberDeviceInfo } from '@/scenes/tasks/shared/detailProgressMemberDeviceInfo.types';
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

/** 归集明细 · 子表行。 */
export type PaymentEngineCollectionDetailLineRecord = {
  id: string;
  amount: string;
  symbol: string;
  minerFee: string;
  minerFeeSymbol: string;
  address: string;
  txHash?: string;
  status: 'pending-confirmation' | 'confirming' | 'send-failed' | 'success';
  timestamp: string;
};

export type PaymentEngineCollectionDetailRecord = {
  collectionNumber: string;
  collectionSymbol: string;
  collectionCryptoName: string;
  collectionNetworkLabel: string;
  collectionAmountRangeKey: string;
  receivingAddress: string;
  receivingAlias?: string;
  collectedAmount: string;
  collectedSymbol: string;
  minerFee: string;
  initiatorName: string;
  progressPercent: number;
  runningStartedAt: number;
  pendingCount: string;
  failedCount: string;
  successCount: string;
  recordLines: PaymentEngineCollectionDetailLineRecord[];
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
  /** 规则配置 / 任务记录 · 归集明细整页派生数据。 */
  collectionDetail?: PaymentEngineCollectionDetailRecord;
  /** 退款记录列表 · 详情 Popup 派生数据。 */
  refundRecordDetail?: PaymentEngineOrderRefundRecord;
  /** 异常支付单记录列表 · 详情 Popup 派生数据。 */
  paymentExceptionRecordDetail?: PaymentEnginePaymentExceptionDetailRecord;
  /** 异常回调列表 · 详情 Popup 派生数据。 */
  callbackErrorRecordDetail?: PaymentEngineCallbackErrorDetailRecord;
  /** 钱包提币列表 · 详情 Popup 派生数据。 */
  walletPayoutDetail?: PaymentEngineWalletPayoutDetailRecord;
  /** 交易历史 / 处理中列表 · 详情 Popup 派生数据。 */
  transactionRecordDetail?: PaymentEngineTransactionRecordDetail;
  /** 规则配置列表 · 详情 Popup 派生数据。 */
  ruleConfigurationDetail?: PaymentEngineRuleConfigurationDetailRecord;
  /** API 归集列表 · 详情 Popup 派生数据。 */
  apiCollectionDetail?: PaymentEngineApiCollectionDetailRecord;
  /** 归集历史 / 处理中列表 · 详情 Popup 派生数据。 */
  collectionRecordDetail?: PaymentEngineCollectionRecordDetail;
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
  /** WaaS 子地址 · 可用余额（展示态数值，不含符号）。 */
  subAddressBalance?: string;
  /** WaaS 交易记录 · 交易类型 i18n key。 */
  transactionTypeKey?: string;
  /** WaaS 提币记录 · 类型 i18n key（API / Manual Operation）。 */
  payoutTypeKey?: string;
  /** WaaS 处理中 · 业务类型 i18n key。 */
  businessTypeKey?: string;
  /** 风控策略 · 权重。 */
  policyWeight?: string;
  /** 风控策略 · 类型 i18n key。 */
  policyTypeKey?: string;
  /** 风控自动化 · 类型 i18n key。 */
  automationTypeKey?: string;
  /** 风控日志 · 操作人展示名。 */
  logOperatorName?: string;
  /** 风控日志 · 操作类型 i18n key。 */
  logActionKey?: string;
  /** 风控日志 · 目标对象 ID（如 API ID）。 */
  logTargetId?: string;
  /** 风控日志 · 策略/自动化名称（Event 列末尾展示）。 */
  logStrategyName?: string;
  /** 风控日志 · 策略编号（筛选）。 */
  logStrategyNumber?: string;
  /** 风控日志 · 类型 i18n key（Policy / Automation / AML / Team API）。 */
  logTypeKey?: string;
  /** AML · 地址或交易哈希展示值。 */
  amlTargetValue?: string;
  /** AML · 网络 Tag（链全名）。 */
  amlNetworkLabel?: string;
  /** AML · 触发方式 i18n key（Manual / Auto）。 */
  amlTriggerModeKey?: string;
  /** AML · 查询人展示名。 */
  amlRequesterName?: string;
  /** AML · 服务商展示名。 */
  amlServiceProvider?: string;
  /** AML · 风险评级 i18n key（Danger / Suspicious / Safe）。 */
  amlRiskLabelKey?: string;
  /** AML · 风险 Tag customStyle（aml-danger / aml-suspicious / aml-safe）。 */
  amlRiskCustomStyle?: 'aml-danger' | 'aml-suspicious' | 'aml-safe';
  /** AML · 风险评分展示值。 */
  amlRiskScore?: string;
  /** AML · WaaS 项目（筛选 / 触发规则详情）。 */
  amlWaasProject?: string;
  /** AML · 查询对象 i18n key（Address / Transaction Hash）。 */
  amlQueryObjectKey?: string;
  /** AML · 币种 symbol（筛选）。 */
  amlCurrencySymbol?: string;
  /** AML · 币种 cryptoName（筛选 / 详情网络图标）。 */
  amlCurrencyCryptoName?: string;
  /** AML · 币种网络 label（筛选）。 */
  amlCurrencyNetworkLabel?: string;
  /** AML · 所属实体。 */
  amlBelongingEntity?: string;
  /** AML · 实体标签。 */
  amlEntityTags?: RiskControlAmlEntityTag[];
  /** AML · 触发规则名称。 */
  amlTriggeredRuleName?: string;
  /** AML · 触发规则编号。 */
  amlTriggeredRuleNumber?: string;
  /** AML · 查询人头像名。 */
  amlRequesterAvatarName?: string;
  /** AML · 查询人脱敏邮箱。 */
  amlRequesterEmailMasked?: string;
  /** AML 自动规则 · WaaS 项目。 */
  autoRuleWaasProject?: string;
  /** AML 自动规则 · 服务商。 */
  autoRuleServiceProvider?: string;
};

export type RiskControlAmlEntityTag = {
  label: string;
  colorfulStyle: TagColorfulStyle;
};

export type RiskControlAmlRiskTraceObject = {
  id: string;
  label: string;
  entityType?: string;
  riskScore?: string;
  riskRating?: string;
  amountUsd?: string;
  contributionPercent?: string;
};

export type RiskControlAmlRiskTraceSection = {
  direction: 'source' | 'destination';
  score: string;
  objects: RiskControlAmlRiskTraceObject[];
};

export type RiskControlAutoRuleCurrencyCondition = {
  symbol: string;
  cryptoName: string;
  networkLabel?: string;
  thresholdAmount: string;
  thresholdSymbol: string;
};

export type RiskControlAutoRuleDetailRecord = {
  creatorName: string;
  creatorAvatarName: string;
  creatorEmailMasked: string;
  createdAt: string;
  recordNumber: string;
  waasProject: string;
  serviceProvider: string;
  currencyConditions: RiskControlAutoRuleCurrencyCondition[];
  hiddenCurrencyConditionCount: number;
  riskRatingCriteria: string;
  alertRecipientName: string;
  alertRecipientAvatarName: string;
  alertRecipientEmailMasked: string;
};

export type PaymentEngineSettlementRecordDetail = {
  successfulPaymentCount: string;
  totalTransactionAmount: string;
  totalTransactionSymbol: string;
  totalFee: string;
  totalFeeSymbol: string;
  settlementAddress: string;
};

export type PaymentEngineRuleConfigurationDetailRecord = {
  ruleNumber: string;
  collectionSymbol: string;
  collectionCryptoName: string;
  collectionNetworkLabel: string;
  collectionAmountRangeKey: string;
  receivingAddress: string;
  creatorName: string;
  creatorAvatarName: string;
  creatorEmailMasked: string;
  creatorDeviceInfo: DetailProgressMemberDeviceInfo;
  createdAt: string;
};

export type PaymentEngineApiCollectionDetailRecord = {
  ipAddress: string;
  createdAt: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  txHash?: string;
  minerFee?: string;
  completionTime?: string;
};

export type PaymentEngineCollectionRecordDetail = {
  businessTypeKey: string;
  submittedBy: string;
  collectionNumber: string;
  startTime: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  txHash?: string;
  minerFee?: string;
  completionTime?: string;
};

export type PaymentEngineTransactionRecordDetail = {
  cregisId: string;
  thirdPartyBusinessNo: string;
  submittedBy: string;
  createdAt: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  txHash?: string;
  blockNumber?: string;
  minerFee?: string;
  completionTime?: string;
  memo?: string;
  remark?: string;
};

export type PaymentEngineWalletPayoutDetailRecord = {
  walletName: string;
  thirdPartyBusinessNo: string;
  initiationTime: string;
  senderAddress: string;
  senderAlias?: string;
  receiverAddress: string;
  receiverAlias?: string;
  txHash?: string;
  blockNumber?: string;
  minerFee?: string;
  completionTime?: string;
  callbackAddress: string;
  ipAddress: string;
  memo?: string;
  remark?: string;
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
  blockNumber?: string;
  businessTypeKey?: string;
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
  | 'refundActions'
  | 'callbackEvent'
  | 'callbackAmount'
  | 'callbackAmountTime'
  | 'callbackStatus'
  | 'callbackTime'
  | 'callbackUrl'
  | 'callbackActions'
  | 'ruleNameId'
  | 'collectionCurrencyRange'
  | 'ruleEnabled'
  | 'ruleActions'
  | 'taskCurrencyId'
  | 'taskStatus'
  | 'taskDateRange'
  | 'taskAmount'
  | 'taskCount'
  | 'collectionHistoryMeta'
  | 'subAddressMeta'
  | 'subAddressActions'
  | 'transactionType'
  | 'payoutType'
  | 'businessType'
  | 'processingMeta'
  | 'processingAmount'
  | 'processingActions'
  | 'policyWeight'
  | 'policyType'
  | 'policyActions'
  | 'automationType'
  | 'automationActions'
  | 'addressBookAddress'
  | 'addressBookActions'
  | 'logType'
  | 'logEvent'
  | 'logActions'
  | 'amlAddressRequester'
  | 'amlServiceProvider'
  | 'amlQueryTime'
  | 'amlRiskScore'
  | 'autoRuleWaasProject'
  | 'autoRuleServiceProvider'
  | 'autoRuleActions';

export type PaymentEngineDataListToolbarPreset =
  | 'default'
  | 'filter-refresh'
  | 'batch-filter-refresh'
  | 'rule-configuration'
  | 'filter-refresh-add-export'
  | 'filter-add';

export type PaymentEngineColumnAlign = 'start' | 'center' | 'end';

export type PaymentEngineRecordColumnConfig = {
  key: PaymentEngineRecordColumnKey;
  labelKey: string;
  secondaryLabelKey?: string;
  minWidth: string;
  /** 固定列宽（不参与 EDS leading flex 均分）；与 minWidth 同值时列锁定不伸缩。 */
  width?: string;
  /** 显式 false 时禁用 flex；未声明时默认 flex（操作列、固定 width 列除外）。 */
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
  /** DataList 行高（px）；默认 66（Xl），Md = 48。 */
  columnHeight?: number;
  toolbarPreset?: PaymentEngineDataListToolbarPreset;
  columns: PaymentEngineRecordColumnConfig[];
  statistics?: Array<{ labelKey: string; value: string }>;
  /** 无筛选角标时也展示 paginer 统计项（如子地址总金额）。 */
  showPaginerStatistics?: boolean;
  /** 动态 paginer 统计：按列表行汇总订单状态金额（支付/订单记录）。 */
  paginerStatisticsKind?: 'order-record';
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
    key: 'orderAmounts',
    labelKey: 'Actual Received Amount',
    secondaryLabelKey: 'Order Amount',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_AMOUNTS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 1,
  },
  {
    key: 'orderIds',
    labelKey: 'Order ID',
    secondaryLabelKey: 'Merchant Order ID',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
    displayOrder: 2,
  },
  {
    key: 'status',
    labelKey: 'Order Status',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
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
export const PAYMENT_ENGINE_REFUND_ACTIONS_COLUMN_MIN_WIDTH = '120px';

/** 异常/历史回调 DataList 列 min-width（§7.7）。
 * 1280 预览 DataList 预算 ≈887px（−80px reserve）。
 * 历史回调 4 列 Σ min 808px：事件 208 + 金额|时间 272 + 状态 128 + URL 200（flex）。
 * 异常回调 4 列 Σ min 848px：事件 208 + 金额|时间 272 + URL 200（flex）+ 操作 168。 */
export const PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH = '208px';
export const PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH = '272px';
export const PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH = '128px';
export const PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH = '200px';
export const PAYMENT_ENGINE_CALLBACK_ACTIONS_COLUMN_MIN_WIDTH = '168px';

const SETTLEMENT_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'orderAmounts',
    labelKey: 'Actual Received Amount',
    secondaryLabelKey: 'Order Amount',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_AMOUNTS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 1,
  },
  {
    key: 'settlementNumber',
    labelKey: 'Settlement ID',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_ORDER_RECORD_ORDER_IDS_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 2,
  },
  {
    key: 'status',
    labelKey: 'Settlement Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'createdAt',
    labelKey: 'Settlement Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

const AMOUNT_ADDRESS_COMBO_COLUMN: PaymentEngineRecordColumnConfig = {
  key: 'bulkAmount',
  labelKey: 'Amount',
  secondaryLabelKey: 'Address',
  minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
  width: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
  headerKind: 'combo',
  sortable: true,
  displayOrder: 1,
};

const BULK_TRANSFER_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  AMOUNT_ADDRESS_COMBO_COLUMN,
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
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 3,
  },
];

const REFUND_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'refundAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_REFUND_AMOUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    sortable: true,
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
    key: 'refundActions',
    labelKey: 'Actions',
    minWidth: PAYMENT_ENGINE_REFUND_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 4,
  },
];

/** 异常支付单：金额|地址 + 状态 + 时间（3 列均 flex）。 */
const PAYMENT_EXCEPTION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: 'Amount',
    secondaryLabelKey: 'Address',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    flexGrow: true,
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    flexGrow: true,
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 3,
  },
];

const WALLET_PAYOUT_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  AMOUNT_ADDRESS_COMBO_COLUMN,
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
    flexGrow: true,
    align: 'end',
    sortable: true,
    displayOrder: 3,
  },
];

const HISTORY_CALLBACK_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackAmountTime',
    labelKey: 'Amount',
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 1,
  },
  {
    key: 'callbackEvent',
    labelKey: 'Callback Event',
    secondaryLabelKey: 'Callback Event ID',
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
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
    key: 'callbackUrl',
    labelKey: 'Callback URL',
    minWidth: PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    displayOrder: 4,
  },
];

const CALLBACK_ERROR_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackAmountTime',
    labelKey: 'Amount',
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 1,
  },
  {
    key: 'callbackEvent',
    labelKey: 'Callback Event',
    secondaryLabelKey: 'Callback Event ID',
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 2,
  },
  {
    key: 'callbackUrl',
    labelKey: 'Callback URL',
    minWidth: PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
    flexGrow: true,
    displayOrder: 3,
  },
  {
    key: 'callbackActions',
    labelKey: 'Actions',
    minWidth: PAYMENT_ENGINE_CALLBACK_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 4,
  },
];

/** WaaS 订单记录 / 支付引擎订单记录共用列表配置（筛选角标 + 统计项）。 */
export const PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG: PaymentEngineRecordPageConfig = {
  showExport: true,
  toolbarPreset: 'filter-refresh',
  showPaginerStatistics: true,
  paginerStatisticsKind: 'order-record',
  columns: ORDER_RECORD_COLUMNS,
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
    toolbarPreset: 'filter-refresh',
    columns: SETTLEMENT_RECORD_COLUMNS,
  },
  'Payment Exception Record': {
    showExport: true,
    toolbarPreset: 'filter-refresh',
    columns: PAYMENT_EXCEPTION_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    showBatchSelect: true,
    toolbarPreset: 'batch-filter-refresh',
    columns: CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolvePaymentEngineRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    PAYMENT_ENGINE_RECORD_PAGE_CONFIG[menuItem as PaymentEngineRecordMenuItem] ??
    PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG
  );
}
