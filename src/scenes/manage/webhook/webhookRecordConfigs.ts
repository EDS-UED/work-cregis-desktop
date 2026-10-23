import type { PaymentEngineRecordPageConfig } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { DATA_LIST_COLUMN_HEIGHT_XL } from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from '../manageMenuData';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';

const WEBHOOK_NAME_ID_MIN = '200px';
const WEBHOOK_EVENT_MIN = '120px';
/** 创建人 | 创建时间 UTC+08:00 · 仅时间排序（略收窄，为状态列留宽）。 */
const WEBHOOK_CREATOR_TIME_MIN = '248px';
const WEBHOOK_STATUS_MIN = '112px';
const WEBHOOK_ACTIONS_MIN = '136px';

const PUSH_NAME_EVENT_MIN = '288px';
const PUSH_TIME_MIN = '200px';
const PUSH_STATUS_MIN = '240px';
const PUSH_ACTIONS_MIN = '152px';

const WEBHOOK_CONFIG_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'webhookNameId',
    labelKey: 'Webhook Name',
    secondaryLabelKey: 'Webhook ID',
    minWidth: WEBHOOK_NAME_ID_MIN,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
    flexGrow: false,
  },
  {
    key: 'webhookEvent',
    labelKey: 'Event Type',
    minWidth: WEBHOOK_EVENT_MIN,
    displayOrder: 2,
    flexGrow: false,
  },
  {
    key: 'webhookCreatorTime',
    labelKey: 'Creator',
    secondaryLabelKey: dataListTimeColumnLabelKey('Webhook Created Time'),
    minWidth: WEBHOOK_CREATOR_TIME_MIN,
    headerKind: 'combo',
    secondarySortable: true,
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'webhookEnabled',
    labelKey: 'Status',
    minWidth: WEBHOOK_STATUS_MIN,
    align: 'center',
    displayOrder: 4,
    flexGrow: false,
  },
  {
    key: 'webhookConfigActions',
    labelKey: 'Actions',
    minWidth: WEBHOOK_ACTIONS_MIN,
    align: 'end',
    displayOrder: 5,
  },
];

const WEBHOOK_PUSH_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'webhookNameEvent',
    labelKey: 'Webhook Name',
    secondaryLabelKey: 'Event Type',
    minWidth: PUSH_NAME_EVENT_MIN,
    headerKind: 'combo',
    displayOrder: 1,
    flexGrow: false,
  },
  {
    key: 'webhookPushStatus',
    labelKey: 'Push Status',
    minWidth: PUSH_STATUS_MIN,
    align: 'center',
    displayOrder: 2,
    flexGrow: false,
  },
  {
    key: 'webhookPushTime',
    labelKey: dataListTimeColumnLabelKey('Last Push Time'),
    minWidth: PUSH_TIME_MIN,
    sortable: true,
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'webhookPushActions',
    labelKey: 'Actions',
    minWidth: PUSH_ACTIONS_MIN,
    align: 'end',
    displayOrder: 4,
  },
];

const WEBHOOK_CONFIG_PAGE: PaymentEngineRecordPageConfig = {
  showExport: false,
  toolbarPreset: 'filter-refresh-add',
  rowCount: PAYMENT_ENGINE_RECORD_ROW_COUNT,
  columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
  columns: WEBHOOK_CONFIG_COLUMNS,
};

const WEBHOOK_PUSH_PAGE: PaymentEngineRecordPageConfig = {
  showExport: false,
  showBatchSelect: true,
  toolbarPreset: 'batch-filter-refresh',
  rowCount: PAYMENT_ENGINE_RECORD_ROW_COUNT,
  columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
  columns: WEBHOOK_PUSH_COLUMNS,
};

export function resolveManageWebhookRecordConfig(menuItem: string): PaymentEngineRecordPageConfig | null {
  if (isManageWebhookConfigMenuItem(menuItem)) return WEBHOOK_CONFIG_PAGE;
  if (isManageWebhookPushRecordsMenuItem(menuItem)) return WEBHOOK_PUSH_PAGE;
  return null;
}
