import type { AppLocale } from '@/composables/useAppLocale';
import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import {
  resolveTasksDataListMenuItem,
  type TasksDataListMenuItemLabel,
} from '../tasksDataListPageData';
import { buildTasksDataListFilterOptionsFromRows } from './buildTasksDataListFilterOptionsFromRows';
import type { TasksDataListFilterRowOptions } from './buildTasksDataListFilterOptionsFromRows';

export type TasksDataListFilterMenuItem = Extract<
  TasksDataListMenuItemLabel,
  'Approval' | 'Signing' | 'Approved' | 'Signed' | 'All Records' | 'Sent Request'
>;

export const TASKS_DATA_LIST_FILTER_MENU_ITEMS: readonly TasksDataListFilterMenuItem[] = [
  'Approval',
  'Signing',
  'Approved',
  'Signed',
  'All Records',
  'Sent Request',
];

const TASKS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU: Record<
  TasksDataListFilterMenuItem,
  readonly string[]
> = {
  Approval: [
    'receiver',
    'currency',
    'initiator',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
  Signing: [
    'receiver',
    'currency',
    'initiator',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
  Approved: [
    'receiver',
    'currency',
    'initiator',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
  Signed: [
    'signingResult',
    'receiver',
    'currency',
    'initiator',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
  'All Records': [
    'approvalProgress',
    'receiver',
    'currency',
    'initiator',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
  'Sent Request': [
    'approvalProgress',
    'receiver',
    'currency',
    'outboundWallet',
    'sender',
    'businessType',
    'application',
    'triggerPolicy',
    'createdAt',
    'thirdPartyBizId',
    'memo',
  ],
};

function isTasksDataListFilterMenuItem(
  menuItem: string | undefined,
): menuItem is TasksDataListFilterMenuItem {
  return (
    menuItem != null
    && Object.prototype.hasOwnProperty.call(TASKS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU, menuItem)
  );
}

export function resolveTasksDataListFilterMenuItem(
  menuItem: string | undefined,
  locale: AppLocale = 'en',
): TasksDataListFilterMenuItem | undefined {
  const resolved = resolveTasksDataListMenuItem(menuItem, locale) ?? menuItem;
  return isTasksDataListFilterMenuItem(resolved) ? resolved : undefined;
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: TasksDataListFilterRowOptions,
): Record<string, EgFilterField> {
  return {
    signingResult: {
      id: 'signingResult',
      label: translate('Signing Result'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.signingResultOptions,
    },
    approvalProgress: {
      id: 'approvalProgress',
      label: translate('Approval Progress'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.approvalProgressOptions,
    },
    receiver: {
      id: 'receiver',
      label: translate('Receiver'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    currency: {
      id: 'currency',
      label: translate('Currency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    initiator: {
      id: 'initiator',
      label: translate('Initiator'),
      kind: 'member',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions: rowOptions.initiatorMemberOptions,
      waasProjectOptions: rowOptions.initiatorWaasProjectOptions,
    },
    outboundWallet: {
      id: 'outboundWallet',
      label: translate('Outbound Wallet'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.outboundWalletOptions,
    },
    sender: {
      id: 'sender',
      label: translate('Sender'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    businessType: {
      id: 'businessType',
      label: translate('Business Type'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.businessTypeOptions,
    },
    application: {
      id: 'application',
      label: translate('App'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.applicationOptions,
    },
    triggerPolicy: {
      id: 'triggerPolicy',
      label: translate('Triggered Policy'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.triggerPolicyOptions,
    },
    createdAt: {
      id: 'createdAt',
      label: translate('Application Time'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    thirdPartyBizId: {
      id: 'thirdPartyBizId',
      label: translate('Third-party Reference'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    memo: {
      id: 'memo',
      label: translate('Memo'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildTasksDataListFilterFields(
  menuItem: string | undefined,
  translate: (key: string) => string,
  locale: AppLocale = 'en',
  rowCount = 0,
): EgFilterField[] {
  const resolvedMenu = resolveTasksDataListFilterMenuItem(menuItem, locale) ?? 'Approval';
  const fieldIds = TASKS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU[resolvedMenu];
  const rowOptions = buildTasksDataListFilterOptionsFromRows(rowCount, {
    menuItem: resolvedMenu,
    locale,
  });
  const catalog = buildFieldCatalog(translate, rowOptions);
  return fieldIds.map((fieldId) => catalog[fieldId]).filter(Boolean) as EgFilterField[];
}

export const TASKS_DATA_LIST_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
