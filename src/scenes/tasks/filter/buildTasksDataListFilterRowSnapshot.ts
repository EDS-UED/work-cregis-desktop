import type { AppLocale } from '@/composables/useAppLocale';
import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { buildApprovalDetailRowFields } from '../approval/buildApprovalDetailRowFields';
import {
  buildBusinessTypeSecondaryLabel,
  splitBusinessTypeSecondaryKey,
} from '../list-field/businessTypeDisplay';
import { buildCurrencySideAddressData } from '../list-field/listFieldCurrencyAddressCustomize';
import { buildTasksListFieldBusinessTypeCustomize } from '../list-field/tasksListFieldBusinessTypeDefaults';
import {
  buildPayoutWalletCode,
  buildPayoutWalletsColumnValues,
  buildSenderWalletDisplayName,
} from '../list-field/tasksListFieldBusinessTypeRowData';
import { buildTasksListFieldCurrencyCustomize } from '../list-field/tasksListFieldCurrencyDefaults';
import { resolveCurrencyRowPreset } from '../list-field/tasksListFieldCurrencyRowData';
import { resolveTasksFilterStatusOptionId } from './buildTasksDataListStatusFilterOptions';
import { buildDetailProgressFields } from '../shared/buildDetailProgressFields';
import { resolveInitiationSourceForRow } from '../shared/resolveInitiationSourceForRow';
import { resolveSwapAppEntryForRow } from '../shared/swapAppEntries';
import { resolveWaasProjectNameForRow } from '../shared/waasProjectNames';
import { resolveTasksDataListFilterMenuItem } from './tasksDataListFilterFields';
import { resolveTasksFilterInitiatorOptionId } from './buildTasksDataListFilterOptionsFromRows';
import { resolveTasksInitiatorFilterRawValue } from './buildTasksDataListInitiatorFilterOptions';
import {
  resolveTasksFilterApplicationOptionId,
  resolveTasksFilterBusinessTypeOptionId,
  resolveTasksFilterOutboundWalletOptionId,
  resolveTasksFilterTriggerPolicyOptionId,
} from './tasksFilterFieldOptions';

type TranslateFn = (key: string) => string;

function joinUnique(values: Array<string | undefined>): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const value of values) {
    const trimmed = String(value ?? '').trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    parts.push(trimmed);
  }
  return parts.join(' ');
}

function buildBusinessTypeSearchText(rowIndex: number, translate: TranslateFn): string {
  const compositeKey = buildBusinessTypeSecondaryLabel(rowIndex);
  const parts = splitBusinessTypeSecondaryKey(compositeKey);
  if (!parts) {
    return joinUnique([compositeKey, translate(compositeKey)]);
  }
  const source = translate(parts.sourceKey);
  const action = translate(parts.actionKey);
  return joinUnique([
    compositeKey,
    translate(compositeKey),
    `${source}｜${action}`,
    `${source}|${action}`,
    source,
    action,
    parts.sourceKey,
    parts.actionKey,
  ]);
}

function buildApplicationSearchText(rowIndex: number): string {
  const source = resolveInitiationSourceForRow(rowIndex);
  if (source.kind === 'application') {
    return resolveSwapAppEntryForRow(rowIndex).label;
  }
  if (source.kind === 'waas-project') {
    return resolveWaasProjectNameForRow(rowIndex);
  }
  return '';
}

function buildReceiverSearchText(rowIndex: number, menuItem?: string): string {
  const customize = buildTasksListFieldCurrencyCustomize(rowIndex, '', menuItem);
  const toSide = buildCurrencySideAddressData('to', customize);
  const detail = buildApprovalDetailRowFields(rowIndex, menuItem);
  const aliases = detail.receivers.map((entry) => entry.alias).filter(Boolean);
  const addresses = detail.receivers.map((entry) => entry.address).filter(Boolean);
  return joinUnique([
    detail.receiverSummary,
    toSide.alias,
    toSide.address,
    ...toSide.addresses,
    ...aliases,
    ...addresses,
  ]);
}

function buildSenderSearchText(
  rowIndex: number,
  locale: AppLocale,
  menuItem?: string,
): string {
  const customize = buildTasksListFieldBusinessTypeCustomize('', rowIndex, menuItem, locale);
  const fromSide = buildCurrencySideAddressData('from', customize);
  const walletName = buildSenderWalletDisplayName(rowIndex, locale);
  const detail = buildApprovalDetailRowFields(rowIndex, menuItem);
  const senderAddresses = detail.senders.map((entry) => entry.address).filter(Boolean);
  const senderAliases = detail.senders.map((entry) => entry.alias).filter(Boolean);
  return joinUnique([
    fromSide.address,
    fromSide.alias,
    ...fromSide.addresses,
    walletName,
    detail.senderSummary,
    ...senderAddresses,
    ...senderAliases,
  ]);
}

/** 与 Tasks 列表同行索引对齐，供 EgFilter 条件匹配。 */
export function buildTasksDataListFilterRowSnapshot(
  rowIndex: number,
  options: {
    translate: TranslateFn;
    locale?: AppLocale;
    menuItem?: string;
  },
): EgFilterRowSnapshot {
  const locale = options.locale ?? 'en';
  const menuItem = options.menuItem ?? 'Approval';
  const resolvedMenu = resolveTasksDataListFilterMenuItem(menuItem, locale) ?? 'Approval';
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const currencyCustomize = buildTasksListFieldCurrencyCustomize(rowIndex, '', menuItem);
  const payoutWallet = buildPayoutWalletsColumnValues(rowIndex);
  const progress = buildDetailProgressFields(rowIndex, {
    initiatorNote: '',
    scenario: 'approval-workflow',
    menuItem,
  });
  const statusOptionId = resolveTasksFilterStatusOptionId(rowIndex, menuItem);

  return {
    signingResult: resolvedMenu === 'Signed' ? statusOptionId : undefined,
    approvalProgress:
      resolvedMenu === 'All Records' || resolvedMenu === 'Sent Request'
        ? statusOptionId
        : undefined,
    receiver: buildReceiverSearchText(rowIndex, menuItem),
    currency: currencyPreset.symbol,
    currencySymbol: currencyPreset.symbol,
    currencyNetwork: String(
      currencyCustomize.networkLabel ?? currencyPreset.networkLabel ?? '',
    ).trim(),
    initiator: resolveTasksFilterInitiatorOptionId(rowIndex, menuItem),
    initiatorSearch: resolveTasksInitiatorFilterRawValue(rowIndex, menuItem),
    outboundWallet: resolveTasksFilterOutboundWalletOptionId(rowIndex),
    outboundWalletSearch: joinUnique([
      payoutWallet.value,
      buildPayoutWalletCode(rowIndex),
    ]),
    sender: buildSenderSearchText(rowIndex, locale, menuItem),
    businessType: resolveTasksFilterBusinessTypeOptionId(rowIndex),
    businessTypeSearch: buildBusinessTypeSearchText(rowIndex, options.translate),
    application: resolveTasksFilterApplicationOptionId(rowIndex),
    applicationSearch: buildApplicationSearchText(rowIndex),
    triggerPolicy: resolveTasksFilterTriggerPolicyOptionId(
      rowIndex,
      progress.strategy,
      menuItem,
    ),
    triggerPolicySearch: progress.strategy,
    createdAt: buildApprovalDetailRowFields(rowIndex, menuItem).appliedAtDisplay,
    thirdPartyBizId: progress.thirdPartyRef,
    memo: progress.memo,
  };
}
