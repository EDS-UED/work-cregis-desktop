import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '../../shared/buildListDerivedFilterOptions';
import {
  WAAS_STANDARD_CALLBACK_MENU_ITEMS,
  type WaasStandardDataListMenuItem,
} from '../waasStandardMenuData';
import { resolveWaasStandardRecordRowCount } from '../waasStandardRecordData';
import type { WaasSubAddressCurrencySelection } from '../waasSubAddressCurrencyPickerData';
import { buildWaasDataListFilterOptionsFromRows } from './buildWaasDataListFilterOptionsFromRows';
import { buildWaasDataListStatusFilterOptions } from './buildWaasDataListStatusFilterOptions';
import {
  WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS,
  type WaasDataListFilterFieldId,
} from './waasDataListFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: WaasDataListFilterFieldId,
): string {
  return translate(WAAS_DATA_LIST_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

const WAAS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU: Record<
  WaasStandardDataListMenuItem,
  readonly string[]
> = {
  'Sub-Address': ['addressStatus', 'address', 'addressAlias', 'callbackAddress'],
  'Wallet Payout': [
    'thirdPartyBizId',
    'receiver',
    'transactionStatus',
    'currency',
    'transactionTime',
    'memo',
    'remark',
  ],
  'Sub-Address Payout': [
    'thirdPartyBizId',
    'receiver',
    'transactionStatus',
    'currency',
    'transactionTime',
    'memo',
    'remark',
  ],
  History: [
    'currency',
    'transactionStatus',
    'amount',
    'collectionId',
    'sender',
    'receiver',
    'businessType',
    'txHash',
    'initiationTime',
  ],
  Processing: [
    'currency',
    'amount',
    'collectionId',
    'sender',
    'receiver',
    'businessType',
    'txHash',
    'initiationTime',
  ],
  'Rule Configuration': ['ruleName', 'ruleNumber', 'ruleStatus', 'currency'],
  'Task Record': [
    'currency',
    'status',
    'collectionId',
    'transactionCount',
    'startTime',
  ],
  'API Collection': [
    'currency',
    'transactionStatus',
    'transactionTime',
    'sender',
    'receiver',
  ],
  'Collection History': [
    'currency',
    'status',
    'amount',
    'collectionId',
    'sender',
    'receiver',
    'businessType',
    'txHash',
    'initiationTime',
  ],
  'Collection Processing': [
    'currency',
    'amount',
    'collectionId',
    'sender',
    'receiver',
    'businessType',
    'txHash',
    'initiationTime',
  ],
  'Callback Error': [
    'txHash',
    'currency',
    'receiver',
    'businessType',
    'thirdPartyBizId',
    'callbackAddress',
    'cregisId',
  ],
  'History Callback': [
    'txHash',
    'currency',
    'receiver',
    'businessType',
    'pushMethod',
    'pushStatus',
    'thirdPartyBizId',
    'callbackAddress',
    'cregisId',
  ],
};

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildWaasDataListFilterOptionsFromRows>,
): Record<string, EgFilterField> {
  return {
    wallet: {
      id: 'wallet',
      label: filterLabel(translate, 'wallet'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    currency: {
      id: 'currency',
      label: filterLabel(translate, 'currency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    transactionTime: {
      id: 'transactionTime',
      label: filterLabel(translate, 'transactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    initiationTime: {
      id: 'initiationTime',
      label: filterLabel(translate, 'initiationTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    startTime: {
      id: 'startTime',
      label: filterLabel(translate, 'startTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    endTime: {
      id: 'endTime',
      label: filterLabel(translate, 'endTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    completionTime: {
      id: 'completionTime',
      label: filterLabel(translate, 'completionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    transactionCount: {
      id: 'transactionCount',
      label: filterLabel(translate, 'transactionCount'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    incomeExpenseType: {
      id: 'incomeExpenseType',
      label: filterLabel(translate, 'incomeExpenseType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.incomeExpenseTypeOptions,
    },
    transactionType: {
      id: 'transactionType',
      label: filterLabel(translate, 'transactionType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.transactionTypeOptions,
    },
    txHash: {
      id: 'txHash',
      label: filterLabel(translate, 'txHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentAddress: {
      id: 'paymentAddress',
      label: filterLabel(translate, 'paymentAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    receivingAddress: {
      id: 'receivingAddress',
      label: filterLabel(translate, 'receivingAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    addressStatus: {
      id: 'addressStatus',
      label: filterLabel(translate, 'addressStatus'),
      kind: 'status',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.addressStatusOptions,
    },
    address: {
      id: 'address',
      label: filterLabel(translate, 'address'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    addressAlias: {
      id: 'addressAlias',
      label: filterLabel(translate, 'addressAlias'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    callbackAddress: {
      id: 'callbackAddress',
      label: filterLabel(translate, 'callbackAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    thirdPartyBizId: {
      id: 'thirdPartyBizId',
      label: filterLabel(translate, 'thirdPartyBizId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    receiver: {
      id: 'receiver',
      label: filterLabel(translate, 'receiver'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    sender: {
      id: 'sender',
      label: filterLabel(translate, 'sender'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    transactionStatus: {
      id: 'transactionStatus',
      label: filterLabel(translate, 'transactionStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.transactionStatusOptions,
    },
    status: {
      id: 'status',
      label: filterLabel(translate, 'status'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.transactionStatusOptions,
    },
    memo: {
      id: 'memo',
      label: filterLabel(translate, 'memo'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    remark: {
      id: 'remark',
      label: filterLabel(translate, 'remark'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    amount: {
      id: 'amount',
      label: filterLabel(translate, 'amount'),
      kind: 'amount',
      amountMode: 'range',
      unit: '',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    ruleName: {
      id: 'ruleName',
      label: filterLabel(translate, 'ruleName'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    ruleNumber: {
      id: 'ruleNumber',
      label: filterLabel(translate, 'ruleNumber'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    ruleStatus: {
      id: 'ruleStatus',
      label: filterLabel(translate, 'ruleStatus'),
      kind: 'status',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.ruleStatusOptions,
    },
    collectionId: {
      id: 'collectionId',
      label: filterLabel(translate, 'collectionId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    businessType: {
      id: 'businessType',
      label: filterLabel(translate, 'businessType'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.businessTypeOptions,
    },
    pushMethod: {
      id: 'pushMethod',
      label: filterLabel(translate, 'pushMethod'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.pushMethodOptions,
    },
    pushStatus: {
      id: 'pushStatus',
      label: filterLabel(translate, 'pushStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.pushStatusOptions,
    },
    cregisId: {
      id: 'cregisId',
      label: filterLabel(translate, 'cregisId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildWaasDataListFilterFields(
  menuItem: string,
  translate: (key: string) => string,
  rowCount?: number,
  subAddressCurrency?: WaasSubAddressCurrencySelection,
): EgFilterField[] {
  const resolvedMenu = menuItem as WaasStandardDataListMenuItem;
  const fieldIds =
    WAAS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU[resolvedMenu]
    ?? WAAS_DATA_LIST_FILTER_FIELD_IDS_BY_MENU.History;

  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolveWaasStandardRecordRowCount(menuItem),
  );

  const rowOptions = buildWaasDataListFilterOptionsFromRows(sourceRowCount, {
    menuItem,
    subAddressCurrency,
  });
  const catalog = buildFieldCatalog(translate, rowOptions);
  return fieldIds
    .map((fieldId) => {
      const baseField = catalog[fieldId];
      if (!baseField) return null;

      const field = baseField;

      if (fieldId === 'transactionStatus' && resolvedMenu === 'History') {
        return {
          ...field,
          selectionMode: 'multi' as const,
          statusOptions: buildWaasDataListStatusFilterOptions(
            sourceRowCount,
            menuItem,
            'transactionStatus',
            subAddressCurrency,
          ),
        };
      }

      if (fieldId === 'status' && resolvedMenu === 'Collection History') {
        return {
          ...field,
          selectionMode: 'multi' as const,
          statusOptions: buildWaasDataListStatusFilterOptions(
            sourceRowCount,
            menuItem,
            'status',
            subAddressCurrency,
          ),
        };
      }

      if (fieldId === 'status' && resolvedMenu === 'Task Record') {
        return {
          ...field,
          selectionMode: 'single' as const,
          statusOptions: buildWaasDataListStatusFilterOptions(
            sourceRowCount,
            menuItem,
            'status',
            subAddressCurrency,
          ),
        };
      }

      if (
        fieldId === 'businessType'
        && WAAS_STANDARD_CALLBACK_MENU_ITEMS.has(resolvedMenu)
      ) {
        return {
          ...field,
          selectionMode: 'multi' as const,
          dropdownOptions: rowOptions.businessTypeOptions,
        };
      }

      if (fieldId === 'pushMethod' && resolvedMenu === 'History Callback') {
        return {
          ...field,
          selectionMode: 'single' as const,
          dropdownOptions: rowOptions.pushMethodOptions,
        };
      }

      if (fieldId === 'pushStatus' && resolvedMenu === 'History Callback') {
        return {
          ...field,
          selectionMode: 'single' as const,
          statusOptions: buildWaasDataListStatusFilterOptions(
            sourceRowCount,
            menuItem,
            'pushStatus',
            subAddressCurrency,
          ),
        };
      }

      return field;
    })
    .filter(Boolean) as EgFilterField[];
}

export const WAAS_DATA_LIST_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
