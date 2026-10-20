import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
  EgFilterFieldStatusOption,
} from '@eds/desktop-components';
import { uniqueDataListFilterOptions } from '../../shared/dataListFilterOptionUtils';
import { buildWaasStandardRecordRows } from '../waasStandardRecordData';
import type { WaasSubAddressCurrencySelection } from '../waasSubAddressCurrencyPickerData';
import { buildWaasDataListCurrencyFilterOptions } from './buildWaasDataListCurrencyFilterOptions';
import { buildWaasDataListStatusFilterOptions } from './buildWaasDataListStatusFilterOptions';
import {
  resolveWaasBusinessTypeLabel,
  resolveWaasIncomeExpenseLabel,
  resolveWaasPushMethodLabel,
} from './waasDataListFilterShared';

export type WaasDataListFilterRowOptions = {
  currencyOptions: EgFilterFieldCurrencyOption[];
  transactionStatusOptions: EgFilterFieldStatusOption[];
  addressStatusOptions: EgFilterFieldStatusOption[];
  ruleStatusOptions: EgFilterFieldStatusOption[];
  pushStatusOptions: EgFilterFieldStatusOption[];
  transactionTypeOptions: EgFilterFieldDropdownOption[];
  incomeExpenseTypeOptions: EgFilterFieldDropdownOption[];
  businessTypeOptions: EgFilterFieldDropdownOption[];
  pushMethodOptions: EgFilterFieldDropdownOption[];
};

export function buildWaasDataListFilterOptionsFromRows(
  rowCount: number,
  options: {
    menuItem: string;
    subAddressCurrency?: WaasSubAddressCurrencySelection;
  },
): WaasDataListFilterRowOptions {
  const menuItem = options.menuItem;
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildWaasStandardRecordRows(menuItem, safeRowCount, options.subAddressCurrency);

  const transactionTypeLabels: string[] = [];
  const incomeExpenseLabels: string[] = [];
  const businessTypeLabels: string[] = [];
  const pushMethodLabels: string[] = [];

  for (const row of rows) {
    const transactionTypeKey = row.transactionTypeKey?.trim();
    if (transactionTypeKey) {
      transactionTypeLabels.push(transactionTypeKey);
    }

    const incomeExpense = resolveWaasIncomeExpenseLabel(row);
    if (incomeExpense) incomeExpenseLabels.push(incomeExpense);

    const businessType = resolveWaasBusinessTypeLabel(row);
    if (businessType) businessTypeLabels.push(businessType);

    const pushMethod = resolveWaasPushMethodLabel(row);
    if (pushMethod) pushMethodLabels.push(pushMethod);
  }

  return {
    currencyOptions: buildWaasDataListCurrencyFilterOptions(
      safeRowCount,
      menuItem,
      options.subAddressCurrency,
    ),
    transactionStatusOptions: buildWaasDataListStatusFilterOptions(
      safeRowCount,
      menuItem,
      'transactionStatus',
      options.subAddressCurrency,
    ),
    addressStatusOptions: buildWaasDataListStatusFilterOptions(
      safeRowCount,
      menuItem,
      'addressStatus',
      options.subAddressCurrency,
    ),
    ruleStatusOptions: buildWaasDataListStatusFilterOptions(
      safeRowCount,
      menuItem,
      'ruleStatus',
      options.subAddressCurrency,
    ),
    pushStatusOptions: buildWaasDataListStatusFilterOptions(
      safeRowCount,
      menuItem,
      'pushStatus',
      options.subAddressCurrency,
    ),
    transactionTypeOptions: uniqueDataListFilterOptions('waas-tx-type', transactionTypeLabels),
    incomeExpenseTypeOptions: uniqueDataListFilterOptions(
      'waas-income-expense',
      incomeExpenseLabels,
    ),
    businessTypeOptions: uniqueDataListFilterOptions('waas-business-type', businessTypeLabels),
    pushMethodOptions: uniqueDataListFilterOptions('waas-push-method', pushMethodLabels),
  };
}
