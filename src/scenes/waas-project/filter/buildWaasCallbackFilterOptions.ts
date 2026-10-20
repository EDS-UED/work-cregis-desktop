import type {
  EgFilterFieldDropdownOption,
  EgFilterFieldStatusOption,
  TagStatus,
} from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import { buildWaasStandardRecordRows } from '../waasStandardRecordData';
import {
  resolveWaasBusinessTypeLabel,
  resolveWaasPushMethodLabel,
} from './waasDataListFilterShared';

/** 与标准 WaaS 异常回调列表 · 业务类型 showcase 一致（§7.8）。 */
const WAAS_CALLBACK_BUSINESS_TYPE_CATALOG_KEYS = [
  'Deposit',
  'Withdrawal',
  'Sub-Address Payout',
] as const;

const WAAS_CALLBACK_PUSH_METHOD_CATALOG_KEYS = ['Manual', 'Auto'] as const;

export function buildWaasCallbackBusinessTypeFilterOptions(
  translate: (key: string) => string,
  rowCount: number,
  menuItem: string,
): EgFilterFieldDropdownOption[] {
  const labels = new Set<string>(WAAS_CALLBACK_BUSINESS_TYPE_CATALOG_KEYS);
  const rows = buildWaasStandardRecordRows(menuItem, Math.max(0, rowCount));
  for (const row of rows) {
    const label = resolveWaasBusinessTypeLabel(row);
    if (label) labels.add(label);
  }
  return [...labels].map((label) => ({
    id: resolveDataListFilterOptionId('waas-business-type', label),
    label: translate(label),
  }));
}

export function buildWaasCallbackPushMethodFilterOptions(
  translate: (key: string) => string,
  rowCount: number,
  menuItem: string,
): EgFilterFieldDropdownOption[] {
  const labels = new Set<string>(WAAS_CALLBACK_PUSH_METHOD_CATALOG_KEYS);
  const rows = buildWaasStandardRecordRows(menuItem, Math.max(0, rowCount));
  for (const row of rows) {
    const label = resolveWaasPushMethodLabel(row);
    if (label) labels.add(label);
  }
  return [...labels].map((label) => ({
    id: resolveDataListFilterOptionId('waas-push-method', label),
    label: translate(label),
  }));
}

export function buildWaasCallbackPushStatusFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldStatusOption[] {
  const entries: Array<{ id: string; labelKey: string; status: TagStatus }> = [
    { id: 'waas-callback-normal', labelKey: 'Normal', status: 'success' },
    { id: 'waas-callback-ignore', labelKey: 'Ignore', status: 'invalid' },
  ];
  return entries.map((entry) => ({
    id: entry.id,
    label: translate(entry.labelKey),
    status: entry.status,
  }));
}
