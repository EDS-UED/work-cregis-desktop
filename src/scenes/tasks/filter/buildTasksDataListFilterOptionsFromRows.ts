import type { AppLocale } from '@/composables/useAppLocale';
import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
  EgFilterFieldMemberOption,
  EgFilterFieldStatusOption,
} from '@eds/desktop-components';
import {
  resolveDataListFilterOptionId,
  uniqueDataListFilterOptions,
} from '../../shared/dataListFilterOptionUtils';
import { buildBusinessTypeFilterActionLabel } from '../list-field/businessTypeDisplay';
import { buildPayoutWalletsColumnValues } from '../list-field/tasksListFieldBusinessTypeRowData';
import { buildDetailProgressFields } from '../shared/buildDetailProgressFields';
import { resolveInitiationSourceForRow } from '../shared/resolveInitiationSourceForRow';
import { resolveSwapAppEntryForRow } from '../shared/swapAppEntries';
import { resolveWaasProjectNameForRow } from '../shared/waasProjectNames';
import { buildTasksDataListCurrencyFilterOptions } from './buildTasksDataListCurrencyFilterOptions';
import {
  buildTasksDataListInitiatorFilterOptions,
  resolveTasksFilterInitiatorMemberId,
} from './buildTasksDataListInitiatorFilterOptions';
import { buildTasksDataListStatusFilterOptions } from './buildTasksDataListStatusFilterOptions';
import { TASKS_FILTER_TRIGGER_POLICY_OPTIONS } from './tasksFilterFieldOptions';

export type TasksDataListFilterRowOptions = {
  currencyOptions: EgFilterFieldCurrencyOption[];
  initiatorMemberOptions: EgFilterFieldMemberOption[];
  initiatorWaasProjectOptions: EgFilterFieldMemberOption[];
  outboundWalletOptions: EgFilterFieldDropdownOption[];
  businessTypeOptions: EgFilterFieldDropdownOption[];
  applicationOptions: EgFilterFieldDropdownOption[];
  triggerPolicyOptions: EgFilterFieldDropdownOption[];
  signingResultOptions: EgFilterFieldStatusOption[];
  approvalProgressOptions: EgFilterFieldStatusOption[];
};

export function buildTasksDataListFilterOptionsFromRows(
  rowCount: number,
  options: {
    menuItem?: string;
    locale?: AppLocale;
  } = {},
): TasksDataListFilterRowOptions {
  const menuItem = options.menuItem ?? 'Approval';
  const safeRowCount = Math.max(0, rowCount);

  const outboundWalletLabels: string[] = [];
  const businessTypeLabels: string[] = [];
  const applicationLabels: string[] = [];
  const triggerPolicyLabels: string[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    outboundWalletLabels.push(buildPayoutWalletsColumnValues(rowIndex).value);

    businessTypeLabels.push(buildBusinessTypeFilterActionLabel(rowIndex));

    const initiationSource = resolveInitiationSourceForRow(rowIndex);
    if (initiationSource.kind === 'application') {
      applicationLabels.push(resolveSwapAppEntryForRow(rowIndex).label);
    } else if (initiationSource.kind === 'waas-project') {
      applicationLabels.push(resolveWaasProjectNameForRow(rowIndex));
    }

    const progress = buildDetailProgressFields(rowIndex, {
      initiatorNote: '',
      scenario: 'approval-workflow',
      menuItem,
    });
    triggerPolicyLabels.push(progress.strategy);
  }

  const currencyOptions = buildTasksDataListCurrencyFilterOptions(safeRowCount, menuItem);
  const { memberOptions: initiatorMemberOptions, waasProjectOptions: initiatorWaasProjectOptions } =
    buildTasksDataListInitiatorFilterOptions(safeRowCount, menuItem);

  const triggerPolicyOptions = uniqueDataListFilterOptions('trigger-policy', triggerPolicyLabels);
  const signingResultOptions = buildTasksDataListStatusFilterOptions(safeRowCount, 'Signed');
  const approvalProgressOptions = buildTasksDataListStatusFilterOptions(safeRowCount, menuItem);

  if (triggerPolicyOptions.length === 0) {
    return {
      currencyOptions,
      initiatorMemberOptions,
      initiatorWaasProjectOptions,
      outboundWalletOptions: uniqueDataListFilterOptions('outbound-wallet', outboundWalletLabels),
      businessTypeOptions: uniqueDataListFilterOptions('business-type', businessTypeLabels),
      applicationOptions: uniqueDataListFilterOptions('application', applicationLabels),
      triggerPolicyOptions: [...TASKS_FILTER_TRIGGER_POLICY_OPTIONS],
      signingResultOptions,
      approvalProgressOptions,
    };
  }

  return {
    currencyOptions,
    initiatorMemberOptions,
    initiatorWaasProjectOptions,
    outboundWalletOptions: uniqueDataListFilterOptions('outbound-wallet', outboundWalletLabels),
    businessTypeOptions: uniqueDataListFilterOptions('business-type', businessTypeLabels),
    applicationOptions: uniqueDataListFilterOptions('application', applicationLabels),
    triggerPolicyOptions,
    signingResultOptions,
    approvalProgressOptions,
  };
}

export function resolveTasksFilterInitiatorOptionId(
  rowIndex: number,
  menuItem?: string,
): string {
  return resolveTasksFilterInitiatorMemberId(rowIndex, menuItem);
}

export function resolveTasksFilterApplicationOptionIdFromRow(
  rowIndex: number,
): string {
  const source = resolveInitiationSourceForRow(rowIndex);
  if (source.kind === 'application') {
    return resolveDataListFilterOptionId(
      'application',
      resolveSwapAppEntryForRow(rowIndex).label,
    );
  }
  if (source.kind === 'waas-project') {
    return resolveDataListFilterOptionId(
      'application',
      resolveWaasProjectNameForRow(rowIndex),
    );
  }
  return '';
}

export function resolveTasksFilterTriggerPolicyOptionIdFromRow(
  rowIndex: number,
  menuItem?: string,
): string {
  const progress = buildDetailProgressFields(rowIndex, {
    initiatorNote: '',
    scenario: 'approval-workflow',
    menuItem,
  });
  return resolveDataListFilterOptionId('trigger-policy', progress.strategy);
}
