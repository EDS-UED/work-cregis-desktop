import {
  PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_ACTIONS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
  type PaymentEngineDataListToolbarPreset,
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordPageConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WaasStandardDataListMenuItem } from './waasStandardMenuData';
import {
  WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS as L,
  waasDataListTimeColumnLabelKey as timeCol,
} from './filter/waasDataListFilterFieldLabelKeys';

/** 列头 labelKey 仅在该列映射到 EgFilter 字段时改用 L.*；时间列与筛选成对（列表 + UTC+08:00 / 筛选短名）。 */

const RULE_ACTIONS_COLUMN_MIN_WIDTH = '168px';
const SUB_ADDRESS_META_COLUMN_MIN_WIDTH = '480px';
const SUB_ADDRESS_ACTIONS_COLUMN_MIN_WIDTH = '180px';
const PAYOUT_STATUS_COLUMN_MIN_WIDTH = '168px';
const PAYOUT_CREATED_TIME_COLUMN_MIN_WIDTH = '176px';
const WAAS_AMOUNT_ADDRESS_COLUMN_MIN_WIDTH = PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH;
const TRANSACTION_TYPE_COLUMN_MIN_WIDTH = '140px';
/**
 * 交易处理中 · 4 列顺序：金额地址 → 交易类型 → 交易时间 → 操作。
 * 操作列须容纳「取消 + 交易加速」双按钮。Σ min 720px + 80px reserve。
 */
const TRANSACTION_PROCESSING_AMOUNT_COLUMN_MIN_WIDTH = '240px';
const TRANSACTION_PROCESSING_TYPE_COLUMN_MIN_WIDTH = '96px';
const TRANSACTION_PROCESSING_TIME_COLUMN_MIN_WIDTH = '144px';
const TRANSACTION_PROCESSING_ACTIONS_COLUMN_MIN_WIDTH = '240px';

const SUB_ADDRESS_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'subAddressMeta',
    labelKey: 'Address',
    secondaryLabelKey: 'Available Balance',
    minWidth: SUB_ADDRESS_META_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    secondarySortable: true,
    displayOrder: 1,
  },
  {
    key: 'subAddressActions',
    labelKey: 'Actions',
    minWidth: SUB_ADDRESS_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 2,
  },
];

const PAYOUT_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.currency,
    secondaryLabelKey: L.receiver,
    minWidth: WAAS_AMOUNT_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: L.transactionStatus,
    minWidth: PAYOUT_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: timeCol('transactionTime'),
    minWidth: PAYOUT_CREATED_TIME_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 3,
  },
];

const TRANSACTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.amount,
    secondaryLabelKey: L.receiver,
    minWidth: WAAS_AMOUNT_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'transactionType',
    labelKey: L.transactionType,
    minWidth: TRANSACTION_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'bulkState',
    labelKey: L.transactionStatus,
    minWidth: PAYOUT_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'createdAt',
    labelKey: timeCol('initiationTime'),
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

const TRANSACTION_PROCESSING_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.amount,
    secondaryLabelKey: L.receiver,
    minWidth: TRANSACTION_PROCESSING_AMOUNT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'transactionType',
    labelKey: L.transactionType,
    minWidth: TRANSACTION_PROCESSING_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: timeCol('initiationTime'),
    minWidth: TRANSACTION_PROCESSING_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    align: 'end',
    displayOrder: 3,
  },
  {
    key: 'processingActions',
    labelKey: 'Actions',
    minWidth: TRANSACTION_PROCESSING_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 4,
  },
];
const RULE_NAME_ID_COLUMN_MIN_WIDTH = '168px';
const RULE_CURRENCY_RANGE_COLUMN_MIN_WIDTH = '208px';
const RULE_STATUS_COLUMN_MIN_WIDTH = '100px';
const RULE_CREATED_TIME_COLUMN_MIN_WIDTH = '168px';

const RULE_CONFIGURATION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'ruleNameId',
    labelKey: L.ruleName,
    secondaryLabelKey: L.ruleNumber,
    minWidth: RULE_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'collectionCurrencyRange',
    labelKey: L.currency,
    secondaryLabelKey: 'Amount Range',
    minWidth: RULE_CURRENCY_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 2,
  },
  {
    key: 'ruleEnabled',
    labelKey: L.ruleStatus,
    minWidth: RULE_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: RULE_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 4,
  },
  {
    key: 'ruleActions',
    labelKey: 'Actions',
    minWidth: RULE_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 5,
  },
];

const TASK_CURRENCY_ID_COLUMN_MIN_WIDTH = '248px';
const TASK_STATUS_COLUMN_MIN_WIDTH = '120px';
const TASK_DATE_RANGE_COLUMN_MIN_WIDTH = '248px';
const TASK_COUNT_COLUMN_MIN_WIDTH = '176px';

const TASK_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'taskCurrencyId',
    labelKey: L.currency,
    secondaryLabelKey: L.transactionCount,
    minWidth: TASK_CURRENCY_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'taskStatus',
    labelKey: L.status,
    minWidth: TASK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'taskCount',
    labelKey: L.collectionId,
    minWidth: TASK_COUNT_COLUMN_MIN_WIDTH,
    displayOrder: 3,
  },
  {
    key: 'taskDateRange',
    labelKey: timeCol('startTime'),
    secondaryLabelKey: 'End Date UTC+08:00',
    minWidth: TASK_DATE_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    align: 'end',
    comboAlignEnd: true,
    displayOrder: 4,
  },
];

const API_COLLECTION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.currency,
    secondaryLabelKey: L.receiver,
    minWidth: WAAS_AMOUNT_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'bulkState',
    labelKey: L.transactionStatus,
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: timeCol('transactionTime'),
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 3,
  },
];

const COLLECTION_HISTORY_META_COLUMN_MIN_WIDTH = '248px';
const COLLECTION_HISTORY_BUSINESS_TYPE_COLUMN_MIN_WIDTH = '140px';

const COLLECTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.amount,
    secondaryLabelKey: L.receiver,
    minWidth: WAAS_AMOUNT_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'businessType',
    labelKey: L.businessType,
    minWidth: COLLECTION_HISTORY_BUSINESS_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'bulkState',
    labelKey: L.status,
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'collectionHistoryMeta',
    labelKey: timeCol('completionTime'),
    secondaryLabelKey: L.collectionId,
    minWidth: COLLECTION_HISTORY_META_COLUMN_MIN_WIDTH,
    align: 'end',
    headerKind: 'combo',
    comboAlignEnd: true,
    sortable: true,
    secondarySortable: false,
    displayOrder: 4,
  },
];

/** 归集处理中 · 4 列顺序：金额地址 → 业务类型 → 完成时间|编号 → 操作。操作列同交易处理中。Σ min 720px + 80px reserve。 */
const COLLECTION_PROCESSING_AMOUNT_COLUMN_MIN_WIDTH = '216px';
const COLLECTION_PROCESSING_BUSINESS_TYPE_COLUMN_MIN_WIDTH = '96px';
const COLLECTION_PROCESSING_META_COLUMN_MIN_WIDTH = '168px';
const COLLECTION_PROCESSING_ACTIONS_COLUMN_MIN_WIDTH = '240px';

/** 归集处理中：金额|地址、业务类型、完成时间|编号、操作。 */
const WAAS_CALLBACK_ERROR_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackEvent',
    labelKey: L.businessType,
    secondaryLabelKey: L.cregisId,
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'callbackAmountTime',
    labelKey: L.currency,
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 2,
  },
  {
    key: 'callbackUrl',
    labelKey: L.callbackAddress,
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

const WAAS_HISTORY_CALLBACK_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'callbackEvent',
    labelKey: L.businessType,
    secondaryLabelKey: L.cregisId,
    minWidth: PAYMENT_ENGINE_CALLBACK_EVENT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'callbackAmountTime',
    labelKey: L.currency,
    secondaryLabelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 2,
  },
  {
    key: 'callbackStatus',
    labelKey: L.pushStatus,
    minWidth: PAYMENT_ENGINE_CALLBACK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'callbackUrl',
    labelKey: L.callbackAddress,
    minWidth: PAYMENT_ENGINE_CALLBACK_URL_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    displayOrder: 4,
  },
];

const COLLECTION_PROCESSING_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'bulkAmount',
    labelKey: L.amount,
    secondaryLabelKey: L.receiver,
    minWidth: COLLECTION_PROCESSING_AMOUNT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
  },
  {
    key: 'businessType',
    labelKey: L.businessType,
    minWidth: COLLECTION_PROCESSING_BUSINESS_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'collectionHistoryMeta',
    labelKey: timeCol('completionTime'),
    secondaryLabelKey: L.collectionId,
    minWidth: COLLECTION_PROCESSING_META_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
    displayOrder: 3,
  },
  {
    key: 'processingActions',
    labelKey: 'Actions',
    minWidth: COLLECTION_PROCESSING_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 4,
  },
];

export const WAAS_STANDARD_RECORD_PAGE_CONFIG: Record<
  WaasStandardDataListMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Sub-Address': {
    showExport: true,
    toolbarPreset: 'filter-refresh-add-export',
    columns: SUB_ADDRESS_COLUMNS,
    showPaginerStatistics: true,
    statistics: [{ labelKey: 'Total amount', value: '1.485698' }],
  },
  'Wallet Payout': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: PAYOUT_RECORD_COLUMNS,
  },
  'Sub-Address Payout': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: PAYOUT_RECORD_COLUMNS,
  },
  History: {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: TRANSACTION_HISTORY_COLUMNS,
  },
  Processing: {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: TRANSACTION_PROCESSING_COLUMNS,
  },
  'Rule Configuration': {
    showExport: false,
    toolbarPreset: 'rule-configuration',
    columns: RULE_CONFIGURATION_COLUMNS,
  },
  'Task Record': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: TASK_RECORD_COLUMNS,
  },
  'API Collection': {
    showExport: false,
    showBatchSelect: true,
    toolbarPreset: 'batch-filter-refresh',
    columns: API_COLLECTION_COLUMNS,
  },
  'Collection History': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: COLLECTION_HISTORY_COLUMNS,
  },
  'Collection Processing': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: COLLECTION_PROCESSING_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    showBatchSelect: true,
    toolbarPreset: 'batch-filter-refresh',
    columns: WAAS_CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: WAAS_HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolveWaasStandardRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    WAAS_STANDARD_RECORD_PAGE_CONFIG[menuItem as WaasStandardDataListMenuItem]
    ?? WAAS_STANDARD_RECORD_PAGE_CONFIG['Rule Configuration']
  );
}
