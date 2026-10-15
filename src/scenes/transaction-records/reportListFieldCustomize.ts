import {
  buildCurrencySideAddressData,
} from '@/scenes/tasks/list-field/listFieldCurrencyAddressCustomize';
import {
  parseTransactionRecordCount,
  transactionRecordShowsMultiTxDetail,
} from './transactionRecordData';
import type { TransactionRecordRow } from './transactionRecordTypes';
import {
  shiftTimestampForTimezone,
  TRANSACTION_RECORDS_TIMEZONE_BASELINE,
  type TransactionRecordsTimezoneOffset,
} from './list-field/transactionRecordsTimezoneOffsets';

/** Showcase list-field-time · 单行 body-medium。 */
export function buildReportTimeCustomize(
  row: TransactionRecordRow,
  timezone: TransactionRecordsTimezoneOffset = TRANSACTION_RECORDS_TIMEZONE_BASELINE,
): Record<string, unknown> {
  return {
    datetime: shiftTimestampForTimezone(
      row.transactionTime,
      TRANSACTION_RECORDS_TIMEZONE_BASELINE,
      timezone,
    ),
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}

export type ReportAddressColumnOptions = {
  enableMultiTxAddressCount?: boolean;
  /** View by Address：不展示已选搜索地址，只留交互对方地址。 */
  hideSelectedAddress?: string;
};

export type ReportAddressColumnModel = {
  fromAddress: string;
  fromAlias?: string;
  toAddress: string;
  toAlias?: string;
  fromAddressCount: number;
  toAddressCount: number;
  fromAddresses: string[];
  toAddresses: string[];
  showFrom: boolean;
  showTo: boolean;
};

function resolveReportAddressSideVisibility(
  row: TransactionRecordRow,
  hideSelectedAddress?: string,
): { fromSideVisible: boolean; toSideVisible: boolean } {
  const hide = hideSelectedAddress?.trim().toLowerCase() ?? '';
  let fromSideVisible = true;
  let toSideVisible = true;
  if (hide) {
    const fromMatch = row.fromAddress.toLowerCase() === hide;
    const toMatch = row.toAddress.toLowerCase() === hide;
    if (fromMatch && !toMatch) {
      fromSideVisible = false;
    } else if (toMatch && !fromMatch) {
      toSideVisible = false;
    } else if (fromMatch && toMatch) {
      // Same address both sides — keep a single from line.
      toSideVisible = false;
    }
  }
  return { fromSideVisible, toSideVisible };
}

function buildReportAddressCustomizeState(
  row: TransactionRecordRow,
  options: ReportAddressColumnOptions = {},
): Record<string, unknown> {
  const multiTx =
    Boolean(options.enableMultiTxAddressCount)
    && transactionRecordShowsMultiTxDetail(row);
  const toAddressCount = multiTx
    ? String(parseTransactionRecordCount(row))
    : '1';
  const { fromSideVisible, toSideVisible } = resolveReportAddressSideVisibility(
    row,
    options.hideSelectedAddress,
  );

  return {
    symbol: row.symbol,
    fromAlias1: row.fromAlias,
    fromAddress1: row.fromAddress,
    fromAddressCount: '1',
    toAlias1: row.toAlias ?? '',
    toAddress1: row.toAddress,
    toAddressCount,
    fromSideVisible,
    toSideVisible,
  };
}

/** Token 列：币种图标 + 网络 Tag（无地址）。Address 视图拆列用。 */
export function buildReportTokenCustomize(row: TransactionRecordRow): Record<string, unknown> {
  return {
    symbol: row.symbol,
    cryptoName: row.cryptoName,
    showNetwork: row.showNetwork,
    networkLabel: row.networkLabel,
    comboMode: 'currency-only',
    entryBadgeMode: 'none',
    addressTooltipTrigger: 'hover',
  };
}

/** Wallet 视图合并列：币种图标 + 网络 Tag + 双地址。 */
export function buildReportCurrencyCustomize(
  row: TransactionRecordRow,
  options: ReportAddressColumnOptions = {},
): Record<string, unknown> {
  const state = buildReportAddressCustomizeState(row, options);
  return {
    symbol: row.symbol,
    cryptoName: row.cryptoName,
    showNetwork: row.showNetwork,
    networkLabel: row.networkLabel,
    comboMode: 'double-address',
    entryBadgeMode: 'none',
    fromAlias1: state.fromAlias1,
    fromAddress1: state.fromAddress1,
    fromAddressCount: state.fromAddressCount,
    toAlias1: state.toAlias1,
    toAddress1: state.toAddress1,
    toAddressCount: state.toAddressCount,
    fromSideVisible: state.fromSideVisible,
    toSideVisible: state.toSideVisible,
    addressTooltipTrigger: 'hover',
  };
}

/** Interaction Address 列：EgCryptoAddress 双地址（无币种头）。Address 视图拆列用。 */
export function buildReportAddressColumnModel(
  row: TransactionRecordRow,
  options: ReportAddressColumnOptions = {},
): ReportAddressColumnModel {
  const state = buildReportAddressCustomizeState(row, options);
  const from = buildCurrencySideAddressData('from', state);
  const to = buildCurrencySideAddressData('to', state);
  return {
    fromAddress: from.address,
    fromAlias: from.alias || undefined,
    toAddress: to.address,
    toAlias: to.alias || undefined,
    fromAddressCount: from.count,
    toAddressCount: to.count,
    fromAddresses: from.addresses,
    toAddresses: to.addresses,
    showFrom: state.fromSideVisible !== false,
    showTo: state.toSideVisible !== false,
  };
}

/** Showcase list-field-general-structure · 单行无头像。 */
export function buildReportWalletCustomize(row: TransactionRecordRow): Record<string, unknown> {
  return {
    value: row.walletName,
    lineLayout: 'single',
    initiatorIconKind: 'none',
    tooltipTrigger: 'hover',
  };
}

/** Showcase list-field-amount · conversion + 右对齐（§7.8 resolveDemoAmountRowValues）。 */
export function buildReportAmountCustomize(row: TransactionRecordRow): Record<string, unknown> {
  return {
    amountType: 'conversion',
    cryptoValue: row.amount,
    cryptoSymbol: row.symbol,
    fiatValue: row.fiatAmount,
    showCryptoIcon: false,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
