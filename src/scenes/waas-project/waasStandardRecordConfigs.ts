import {
  CALLBACK_ERROR_COLUMNS,
  HISTORY_CALLBACK_COLUMNS,
  PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
  PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
  type PaymentEngineDataListToolbarPreset,
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordPageConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WaasStandardDataListMenuItem } from './waasStandardMenuData';

const RULE_NAME_ID_COLUMN_MIN_WIDTH = '200px';
const RULE_CURRENCY_RANGE_COLUMN_MIN_WIDTH = '248px';
const RULE_STATUS_COLUMN_MIN_WIDTH = '120px';
const RULE_ACTIONS_COLUMN_MIN_WIDTH = '160px';

const RULE_CONFIGURATION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'ruleNameId',
    labelKey: 'Rule Name',
    secondaryLabelKey: 'Number',
    minWidth: RULE_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'collectionCurrencyRange',
    labelKey: 'Collection Currency',
    secondaryLabelKey: 'Amount Range',
    minWidth: RULE_CURRENCY_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 2,
  },
  {
    key: 'ruleEnabled',
    labelKey: 'Status',
    minWidth: RULE_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'createdAt',
    labelKey: 'Creation Time UTC+08:00',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 4,
  },
  {
    key: 'ruleActions',
    labelKey: 'Actions',
    minWidth: RULE_ACTIONS_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    displayOrder: 5,
  },
];

const TASK_CURRENCY_ID_COLUMN_MIN_WIDTH = '248px';
const TASK_STATUS_COLUMN_MIN_WIDTH = '120px';
const TASK_DATE_RANGE_COLUMN_MIN_WIDTH = '248px';
const TASK_AMOUNT_COLUMN_MIN_WIDTH = '120px';
const TASK_COUNT_COLUMN_MIN_WIDTH = '120px';

const TASK_RECORD_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'taskCurrencyId',
    labelKey: 'Currency',
    secondaryLabelKey: 'Collection Number',
    minWidth: TASK_CURRENCY_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'taskStatus',
    labelKey: 'Status',
    minWidth: TASK_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 2,
  },
  {
    key: 'taskDateRange',
    labelKey: 'Start Date',
    secondaryLabelKey: 'End Date',
    minWidth: TASK_DATE_RANGE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 3,
  },
  {
    key: 'taskAmount',
    labelKey: 'Amount',
    minWidth: TASK_AMOUNT_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
  {
    key: 'taskCount',
    labelKey: 'Transaction Count',
    minWidth: TASK_COUNT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    align: 'end',
    displayOrder: 5,
  },
];

const API_COLLECTION_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Currency',
    secondaryLabelKey: 'Address',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    width: PAYMENT_ENGINE_BULK_TRANSFER_TOKEN_ADDRESS_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'createdAt',
    labelKey: 'Initiation Time',
    minWidth: PAYMENT_ENGINE_ORDER_RECORD_CREATED_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    displayOrder: 2,
  },
  {
    key: 'bulkState',
    labelKey: 'Status',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
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

const COLLECTION_HISTORY_META_COLUMN_MIN_WIDTH = '248px';

const COLLECTION_HISTORY_COLUMNS: PaymentEngineRecordColumnConfig[] = [
  {
    key: 'crypto',
    labelKey: 'Currency',
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
    key: 'collectionHistoryMeta',
    labelKey: 'Completion Time',
    secondaryLabelKey: 'Collection Number',
    minWidth: COLLECTION_HISTORY_META_COLUMN_MIN_WIDTH,
    flexGrow: true,
    headerKind: 'combo',
    sortable: true,
    secondarySortable: false,
    displayOrder: 3,
  },
  {
    key: 'bulkAmount',
    labelKey: 'Amount',
    minWidth: PAYMENT_ENGINE_BULK_TRANSFER_AMOUNT_COLUMN_MIN_WIDTH,
    align: 'end',
    sortable: true,
    displayOrder: 4,
  },
];

export const WAAS_STANDARD_RECORD_PAGE_CONFIG: Record<
  WaasStandardDataListMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Rule Configuration': {
    showExport: false,
    toolbarPreset: 'rule-configuration',
    columns: RULE_CONFIGURATION_COLUMNS,
    rowCount: 1,
  },
  'Task Record': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: TASK_RECORD_COLUMNS,
    rowCount: 3,
  },
  'API Collection': {
    showExport: false,
    showBatchSelect: true,
    filterBadge: 1,
    toolbarPreset: 'batch-filter-refresh',
    columns: API_COLLECTION_COLUMNS,
    rowCount: 8,
  },
  History: {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: COLLECTION_HISTORY_COLUMNS,
    rowCount: 3,
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

export function resolveWaasStandardRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    WAAS_STANDARD_RECORD_PAGE_CONFIG[menuItem as WaasStandardDataListMenuItem]
    ?? WAAS_STANDARD_RECORD_PAGE_CONFIG['Rule Configuration']
  );
}
