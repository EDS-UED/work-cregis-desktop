import type { EgFilterFieldStatusOption } from '@eds/desktop-components';
import type { TagStatus } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import { buildPaymentEngineRecordStatusCustomize } from '../../payment-engine/paymentEngineRecordStatusCustomize';
import type { PaymentEngineRecordRow } from '../../payment-engine/paymentEngineRecordConfigs';
import { buildWaasStandardRecordRows } from '../waasStandardRecordData';
import type { WaasSubAddressCurrencySelection } from '../waasSubAddressCurrencyPickerData';

const WAAS_STATUS_FILTER_NAMESPACE = 'waas-status';

const SUB_ADDRESS_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  { id: 'waas-sub-address-active', label: 'Active', status: 'success' as TagStatus },
  { id: 'waas-sub-address-disabled', label: 'Disable', status: 'invalid' as TagStatus },
];

const RULE_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  { id: 'waas-rule-enabled', label: 'Enabled', status: 'success' as TagStatus },
  { id: 'waas-rule-disabled', label: 'Disabled', status: 'invalid' as TagStatus },
];

const CALLBACK_PUSH_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  { id: 'waas-callback-normal', label: 'Normal', status: 'success' as TagStatus },
  { id: 'waas-callback-ignore', label: 'Ignore', status: 'invalid' as TagStatus },
];

function toStatusFilterOption(
  label: string,
  status: TagStatus,
): EgFilterFieldStatusOption {
  return {
    id: resolveDataListFilterOptionId(WAAS_STATUS_FILTER_NAMESPACE, label),
    label,
    status,
  };
}

/** 失败 / 已取消 / 成功三态（交易历史、归集历史列表一致）。 */
const FAILED_CANCELED_SUCCESS_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  toStatusFilterOption('Failed', 'danger'),
  toStatusFilterOption('Canceled', 'invalid'),
  toStatusFilterOption('Success', 'success'),
];

/** 任务记录：归集中 / 已结束。 */
const TASK_RECORD_STATUS_OPTIONS: readonly EgFilterFieldStatusOption[] = [
  toStatusFilterOption('Collecting', 'warning'),
  toStatusFilterOption('Finished', 'invalid'),
];

function uniqueStatusOptionsFromRows(
  rows: readonly PaymentEngineRecordRow[],
  menuItem: string,
): EgFilterFieldStatusOption[] {
  const seen = new Set<string>();
  const options: EgFilterFieldStatusOption[] = [];

  for (const row of rows) {
    const customize = buildPaymentEngineRecordStatusCustomize(row, menuItem);
    const label = String(customize.label ?? '').trim();
    const status = String(customize.status ?? 'success') as TagStatus;
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push(toStatusFilterOption(label, status));
  }

  return options;
}

export function buildWaasDataListStatusFilterOptions(
  rowCount: number,
  menuItem: string,
  fieldId: string,
  subAddressCurrency?: WaasSubAddressCurrencySelection,
): EgFilterFieldStatusOption[] {
  if (menuItem === 'Sub-Address' && fieldId === 'addressStatus') {
    return [...SUB_ADDRESS_STATUS_OPTIONS];
  }
  if (menuItem === 'Rule Configuration' && fieldId === 'ruleStatus') {
    return [...RULE_STATUS_OPTIONS];
  }
  if (menuItem === 'History Callback' && fieldId === 'pushStatus') {
    return [...CALLBACK_PUSH_STATUS_OPTIONS];
  }
  if (menuItem === 'History' && fieldId === 'transactionStatus') {
    return [...FAILED_CANCELED_SUCCESS_STATUS_OPTIONS];
  }
  if (menuItem === 'Collection History' && fieldId === 'status') {
    return [...FAILED_CANCELED_SUCCESS_STATUS_OPTIONS];
  }
  if (menuItem === 'Task Record' && fieldId === 'status') {
    return [...TASK_RECORD_STATUS_OPTIONS];
  }

  const rows = buildWaasStandardRecordRows(menuItem, Math.max(0, rowCount), subAddressCurrency);
  return uniqueStatusOptionsFromRows(rows, menuItem);
}

export function resolveWaasFilterStatusOptionId(
  row: PaymentEngineRecordRow,
  menuItem: string,
  fieldId: string,
  rowIndex = 0,
): string {
  if (menuItem === 'Sub-Address' && fieldId === 'addressStatus') {
    return rowIndex % 5 === 4 ? 'waas-sub-address-disabled' : 'waas-sub-address-active';
  }
  if (menuItem === 'Rule Configuration' && fieldId === 'ruleStatus') {
    return row.ruleEnabled ? 'waas-rule-enabled' : 'waas-rule-disabled';
  }
  if (menuItem === 'History Callback' && fieldId === 'pushStatus') {
    return row.callbackStatus === 'ignore' ? 'waas-callback-ignore' : 'waas-callback-normal';
  }

  const customize = buildPaymentEngineRecordStatusCustomize(row, menuItem);
  return resolveDataListFilterOptionId(
    WAAS_STATUS_FILTER_NAMESPACE,
    String(customize.label ?? ''),
  );
}
