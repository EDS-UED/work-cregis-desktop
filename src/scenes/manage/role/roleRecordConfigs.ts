import type { PaymentEngineRecordPageConfig } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { DATA_LIST_COLUMN_HEIGHT_XL } from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';
import { isManageRoleMenuItem } from '../manageMenuData';

const ROLE_NAME_MIN = '272px';
/** 创建人 | 创建时间 UTC+08:00 · 仅时间排序（176 − 80）。 */
const ROLE_CREATOR_TIME_MIN = '96px';
/** 状态（112 + 80）。 */
const ROLE_STATUS_MIN = '192px';
const ROLE_ACTIONS_MIN = '168px';

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
    key: 'roleEnabled',
    labelKey: 'Status',
    minWidth: ROLE_STATUS_MIN,
    width: ROLE_STATUS_MIN,
    align: 'center',
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'roleActions',
    labelKey: 'Actions',
    minWidth: ROLE_ACTIONS_MIN,
    align: 'end',
    displayOrder: 4,
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
