import type { PaymentEngineRecordPageConfig } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { DATA_LIST_COLUMN_HEIGHT_XL } from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';
import { isManageApiManageMenuItem } from '../manageMenuData';
import { TEAM_API_MOCK_ROW_COUNT } from './teamApiMockData';

const TEAM_API_NAME_KEY_MIN = '220px';
const TEAM_API_PERMISSIONS_MIN = '96px';
const TEAM_API_CREATOR_TIME_MIN = '248px';
const TEAM_API_STATUS_MIN = '112px';
const TEAM_API_ACTIONS_MIN = '168px';

const TEAM_API_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'teamApiNameKey',
    labelKey: 'API Name',
    secondaryLabelKey: 'API Key',
    minWidth: TEAM_API_NAME_KEY_MIN,
    headerKind: 'combo',
    sortable: true,
    displayOrder: 1,
    flexGrow: false,
  },
  {
    key: 'teamApiPermissions',
    labelKey: 'Permissions',
    minWidth: TEAM_API_PERMISSIONS_MIN,
    displayOrder: 2,
    flexGrow: false,
  },
  {
    key: 'teamApiCreatorTime',
    labelKey: 'Creator',
    secondaryLabelKey: dataListTimeColumnLabelKey('API Created Time'),
    minWidth: TEAM_API_CREATOR_TIME_MIN,
    headerKind: 'combo',
    secondarySortable: true,
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'teamApiEnabled',
    labelKey: 'Status',
    minWidth: TEAM_API_STATUS_MIN,
    align: 'center',
    displayOrder: 4,
    flexGrow: false,
  },
  {
    key: 'teamApiActions',
    labelKey: 'Actions',
    minWidth: TEAM_API_ACTIONS_MIN,
    align: 'end',
    displayOrder: 5,
  },
];

const TEAM_API_PAGE: PaymentEngineRecordPageConfig = {
  showExport: false,
  toolbarPreset: 'refresh-add',
  rowCount: TEAM_API_MOCK_ROW_COUNT,
  columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
  dataListFill: true,
  columns: TEAM_API_COLUMNS,
};

export function resolveManageTeamApiRecordConfig(
  menuItem: string,
): PaymentEngineRecordPageConfig | null {
  if (!isManageApiManageMenuItem(menuItem)) return null;
  return TEAM_API_PAGE;
}
