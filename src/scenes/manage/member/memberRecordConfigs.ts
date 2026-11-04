import type { PaymentEngineRecordPageConfig } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { DATA_LIST_COLUMN_HEIGHT_XL } from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';
import { isManageMemberMenuItem } from '../manageMenuData';

const MEMBER_NICKNAME_EMAIL_MIN = '208px';
const MEMBER_ROLE_MIN = '160px';
const MEMBER_STATUS_MIN = '160px';
const MEMBER_JOINED_TIME_MIN = '176px';
const MEMBER_ACTIONS_MIN = '160px';

const MEMBER_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'memberNicknameEmail',
    labelKey: 'Member Nickname',
    secondaryLabelKey: 'Email',
    minWidth: MEMBER_NICKNAME_EMAIL_MIN,
    headerKind: 'combo',
    displayOrder: 1,
    flexGrow: false,
  },
  {
    key: 'memberRole',
    labelKey: 'Role Name',
    minWidth: MEMBER_ROLE_MIN,
    width: MEMBER_ROLE_MIN,
    displayOrder: 2,
    flexGrow: false,
  },
  {
    key: 'memberStatus',
    labelKey: 'Status',
    minWidth: MEMBER_STATUS_MIN,
    width: MEMBER_STATUS_MIN,
    align: 'center',
    displayOrder: 3,
    flexGrow: false,
  },
  {
    key: 'memberJoinedTime',
    labelKey: dataListTimeColumnLabelKey('Member Joined Time'),
    minWidth: MEMBER_JOINED_TIME_MIN,
    sortable: true,
    displayOrder: 4,
    flexGrow: false,
  },
  {
    key: 'memberActions',
    labelKey: 'Actions',
    minWidth: MEMBER_ACTIONS_MIN,
    align: 'end',
    displayOrder: 5,
  },
];

const MEMBER_PAGE: PaymentEngineRecordPageConfig = {
  showExport: false,
  toolbarPreset: 'filter-refresh-add',
  rowCount: PAYMENT_ENGINE_RECORD_ROW_COUNT,
  columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
  dataListFill: true,
  columns: MEMBER_COLUMNS,
};

export function resolveManageMemberRecordConfig(menuItem: string): PaymentEngineRecordPageConfig | null {
  if (!isManageMemberMenuItem(menuItem)) return null;
  return MEMBER_PAGE;
}
