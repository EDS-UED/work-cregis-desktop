import {
  PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
  WALLET_PAYOUT_CALLBACK_RECEIVER_COLUMN,
  WALLET_PAYOUT_CALLBACK_SENDER_COLUMN,
  WALLET_PAYOUT_COLUMNS,
  type PaymentEngineDataListToolbarPreset,
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordPageConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WaasStandardDataListMenuItem } from './waasStandardMenuData';
import { WAAS_STANDARD_HISTORY_CALLBACK_COLUMNS } from './waasStandardHistoryCallbackColumns';
import {
  WAAS_TRANSACTION_HISTORY_COLUMNS,
  WAAS_TRANSACTION_PROCESSING_COLUMNS,
} from './waasStandardTransactionHistoryColumns';
import { WAAS_STANDARD_CALLBACK_ERROR_COLUMNS } from './waasStandardCallbackErrorColumns';
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

const PAYOUT_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = WALLET_PAYOUT_COLUMNS;

const TRANSACTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] =
  WAAS_TRANSACTION_HISTORY_COLUMNS;

const TRANSACTION_PROCESSING_LIST_COLUMNS: PaymentEngineRecordColumnConfig[] =
  WAAS_TRANSACTION_PROCESSING_COLUMNS;

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
const RULE_CREATOR_TIME_COLUMN_MIN_WIDTH = '192px';

const RULE_CONFIGURATION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'ruleNameId',
    labelKey: L.ruleName,
    secondaryLabelKey: 'Number',
    minWidth: RULE_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'collectionCurrencyRange',
    labelKey: 'Track Currency',
    secondaryLabelKey: 'Amount Range',
    minWidth: RULE_CURRENCY_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 2,
  },
  {
    key: 'ruleEnabled',
    labelKey: L.status,
    minWidth: RULE_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'ruleCreatorTime',
    labelKey: 'Creator',
    secondaryLabelKey: 'Creation Time',
    minWidth: RULE_CREATOR_TIME_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    secondarySortable: true,
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

const TASK_COLLECTION_NUMBER_COLUMN_MIN_WIDTH = '201px';
const TASK_DATE_RANGE_COLUMN_MIN_WIDTH = '138px';
const TASK_STATUS_COLUMN_MIN_WIDTH = '135px';
const TASK_AMOUNT_COUNT_COLUMN_MIN_WIDTH = '318px';

/** 任务记录 · 4 列：归集编号 → 开始|接收时间 → 状态 → 归集金额|笔数。 */
const TASK_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'taskCount',
    labelKey: L.collectionId,
    minWidth: TASK_COLLECTION_NUMBER_COLUMN_MIN_WIDTH,
    displayOrder: 1,
  },
  {
    key: 'taskDateRange',
    labelKey: 'Start',
    secondaryLabelKey: 'End Time',
    minWidth: TASK_DATE_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 2,
  },
  {
    key: 'taskStatus',
    labelKey: L.status,
    minWidth: TASK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'taskCurrencyId',
    labelKey: 'Collection Amount',
    secondaryLabelKey: L.transactionCount,
    minWidth: TASK_AMOUNT_COUNT_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    sortable: true,
    align: 'end',
    comboAlignEnd: true,
    displayOrder: 4,
  },
];

const API_COLLECTION_SENDER_COLUMN_MIN_WIDTH = '180px';
const API_COLLECTION_RECEIVER_COLUMN_MIN_WIDTH = '180px';
const API_COLLECTION_AMOUNT_TIME_COLUMN_MIN_WIDTH = '208px';
const API_COLLECTION_STATUS_COLUMN_MIN_WIDTH = '120px';
const API_COLLECTION_ACTIONS_COLUMN_MIN_WIDTH = '192px';

/** API 归集 · 5 列：发送方、接收方、金额|发起时间、状态、操作（驳回、归集）。 */
const API_COLLECTION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    ...WALLET_PAYOUT_CALLBACK_SENDER_COLUMN,
    minWidth: API_COLLECTION_SENDER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 1,
  },
  {
    ...WALLET_PAYOUT_CALLBACK_RECEIVER_COLUMN,
    minWidth: API_COLLECTION_RECEIVER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 2,
  },
  {
    key: 'callbackAmountTime',
    labelKey: L.amount,
    secondaryLabelKey: timeCol('initiationTime'),
    minWidth: API_COLLECTION_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    displayOrder: 3,
  },
  {
    key: 'bulkState',
    labelKey: L.status,
    minWidth: API_COLLECTION_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    flexGrow: false,
    displayOrder: 4,
  },
  {
    key: 'apiCollectionActions',
    labelKey: 'Actions',
    minWidth: API_COLLECTION_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 5,
  },
];

const COLLECTION_HISTORY_BUSINESS_ID_COLUMN_MIN_WIDTH = '132px';
const COLLECTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH = '180px';
const COLLECTION_HISTORY_STATUS_COLUMN_MIN_WIDTH = '120px';
const COLLECTION_HISTORY_AMOUNT_TIME_COLUMN_MIN_WIDTH = '200px';

/** 归集历史 · 5 列：业务类型|归集编号、发送方、接收方、状态、金额|完成时间。 */
const COLLECTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'collectionBusinessId',
    labelKey: L.businessType,
    secondaryLabelKey: L.collectionId,
    minWidth: COLLECTION_HISTORY_BUSINESS_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    flexGrow: false,
    displayOrder: 1,
  },
  {
    ...WALLET_PAYOUT_CALLBACK_SENDER_COLUMN,
    minWidth: COLLECTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 2,
  },
  {
    ...WALLET_PAYOUT_CALLBACK_RECEIVER_COLUMN,
    minWidth: COLLECTION_HISTORY_ADDRESS_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 3,
  },
  {
    key: 'bulkState',
    labelKey: L.status,
    minWidth: COLLECTION_HISTORY_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    flexGrow: false,
    displayOrder: 4,
  },
  {
    key: 'callbackAmountTime',
    labelKey: L.amount,
    secondaryLabelKey: timeCol('completionTime'),
    minWidth: COLLECTION_HISTORY_AMOUNT_TIME_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: true,
    align: 'end',
    comboAlignEnd: true,
    displayOrder: 5,
  },
];

/** 归集处理中 · 与历史同表无状态列；操作在详情页，列表无操作列。 */
const COLLECTION_PROCESSING_COLUMNS: PaymentEngineRecordColumnConfig[] =
  COLLECTION_HISTORY_COLUMNS.filter((column) => column.key !== 'bulkState').map((column) =>
    column.key === 'callbackAmountTime' ? { ...column, displayOrder: 4 } : column,
  );

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
    columns: TRANSACTION_PROCESSING_LIST_COLUMNS,
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
    columns: WAAS_STANDARD_CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: WAAS_STANDARD_HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolveWaasStandardRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    WAAS_STANDARD_RECORD_PAGE_CONFIG[menuItem as WaasStandardDataListMenuItem]
    ?? WAAS_STANDARD_RECORD_PAGE_CONFIG['Rule Configuration']
  );
}
