import {
  PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH,
  type PaymentEngineRecordPageConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { DATA_LIST_COLUMN_HEIGHT_XL } from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';
import { isManageRoleMenuItem } from '../manageMenuData';

const ROLE_NAME_MIN = '232px';
/** 创建人 | 创建时间 UTC+08:00 · 仅时间排序，对齐 Webhook 配置列表组合列。 */
const ROLE_CREATOR_TIME_MIN = PAYMENT_ENGINE_CALLBACK_AMOUNT_TIME_COLUMN_MIN_WIDTH;
const ROLE_ACTIONS_MIN = '200px';

const ROLE_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'roleName',
    labelKey: 'Role Name',
    minWidth: ROLE_NAME_MIN,
    width: ROLE_NAME_MIN,
    displayOrder: 1,
    flexGrow: false,
  },
  {
    key: 'roleCreatorTime',
    labelKey: 'Creator',
    secondaryLabelKey: dataListTimeColumnLabelKey('Role Created Time'),
    minWidth: ROLE_CREATOR_TIME_MIN,
    headerKind: 'combo',
    secondarySortable: true,
    displayOrder: 2,
    flexGrow: false,
  },
  {
    key: 'roleActions',
    labelKey: 'Actions',
    minWidth: ROLE_ACTIONS_MIN,
    align: 'end',
    displayOrder: 3,
  },
];

const ROLE_PAGE: PaymentEngineRecordPageConfig = {
  showExport: false,
  toolbarPreset: 'filter-refresh-add',
  rowCount: PAYMENT_ENGINE_RECORD_ROW_COUNT,
  columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
  dataListFill: true,
  columns: ROLE_COLUMNS,
};

export function resolveManageRoleRecordConfig(menuItem: string): PaymentEngineRecordPageConfig | null {
  if (!isManageRoleMenuItem(menuItem)) return null;
  return ROLE_PAGE;
}
