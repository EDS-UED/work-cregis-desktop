import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import {
  resolveDemoAmountRowValues,
  resolveVerifiedTxHashForRow,
} from '@/scenes/shared/egDataListMockData';
import type { CurrencyRowPreset } from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowPresets';
import { FEE_RECORD_OPERATION_TYPE_KEYS } from './feeRecordOperationTypes';
import {
  FEE_RECORD_DETAIL_SHOW_CRYPTO_CARD,
  FEE_RECORD_DETAIL_SHOW_CURRENCY,
  FEE_RECORD_DETAIL_SHOW_ORDER_NUMBER,
  FEE_RECORD_DETAIL_SHOW_PLAN,
  FEE_RECORD_DETAIL_SHOW_AML_SERVICE_PROVIDER,
  FEE_RECORD_DETAIL_TRON_FEE_WITH_TX_HASH,
} from './feeRecordDetailFieldPolicy';
import type { CryptoAddressFamily } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import type { FeeRecordAccountKey, FeeRecordRow } from './feeRecordTypes';
import {
  pickFeeRecordGasAccountListSlot,
  type FeeRecordGasAccountListSlot,
} from './feeRecordGasAccountListShape';

/** 列表 demo 总量：2 条账户划出状态示范 + 原 28 条。 */
export const FEE_RECORDS_DEMO_TOTAL = 30;

const FEE_RECORD_LEGACY_OFFSET = 2;

function resolveLegacyRowIndex(index: number): number | null {
  if (index < FEE_RECORD_LEGACY_OFFSET) return null;
  return index - FEE_RECORD_LEGACY_OFFSET;
}

/** 列表 legacy 1–3 · 非划转型演示仍可挂 Gas 子账户 + 币种主行。 */
const FEE_RECORD_LIST_GAS_ACCOUNT_OVERRIDES: Record<number, FeeRecordGasAccountListSlot> = {
  1: pickFeeRecordGasAccountListSlot(0),
  2: pickFeeRecordGasAccountListSlot(1),
  3: pickFeeRecordGasAccountListSlot(2),
};

const OPERATOR_NAMES = [
  'Alex Chen',
  'Dana Wu',
  'Treasury',
  'Ops Team',
  'Ben',
  'Chris',
] as const;

function resolveOperatorName(index: number): string {
  return OPERATOR_NAMES[index % OPERATOR_NAMES.length]!;
}

function formatTransactionTime(index: number): string {
  const day = 23 + (index % 7);
  const hour = 8 + (index % 12);
  const minute = (index * 7) % 60;
  const second = (index * 13) % 60;
  return `2032-10-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

function resolveOperationType(index: number) {
  return FEE_RECORD_OPERATION_TYPE_KEYS[index % FEE_RECORD_OPERATION_TYPE_KEYS.length]!;
}

function resolveAccountKey(index: number): FeeRecordAccountKey {
  if (index in FEE_RECORD_LIST_GAS_ACCOUNT_OVERRIDES) return 'Gas Account';
  return 'Team Account';
}

function resolveListGasAccountOverride(index: number): FeeRecordGasAccountListSlot | undefined {
  return FEE_RECORD_LIST_GAS_ACCOUNT_OVERRIDES[index];
}

function resolveListAmountAccountFields(
  legacyIndex: number,
  operationTypeKey: FeeRecordRow['operationTypeKey'],
): Pick<
  FeeRecordRow,
  | 'accountKey'
  | 'accountDisplayKey'
  | 'amount'
  | 'listAmountCryptoSymbol'
  | 'listAmountCryptoName'
> {
  if (operationTypeKey === 'Account Transfer In') {
    const slot = pickFeeRecordGasAccountListSlot(legacyIndex);
    return {
      accountKey: 'Gas Account',
      accountDisplayKey: slot.accountDisplayKey,
      amount: slot.demoNativeAmount,
      listAmountCryptoSymbol: slot.listAmountCryptoSymbol,
      listAmountCryptoName: slot.listAmountCryptoName,
    };
  }
  if (operationTypeKey === 'Account Transfer Out') {
    return {
      accountKey: 'Team Account',
      amount: formatAmount(legacyIndex),
    };
  }
  const gasListOverride = resolveListGasAccountOverride(legacyIndex);
  return {
    accountKey: resolveAccountKey(legacyIndex),
    accountDisplayKey: gasListOverride?.accountDisplayKey,
    amount: gasListOverride?.demoNativeAmount ?? formatAmount(legacyIndex),
    listAmountCryptoSymbol: gasListOverride?.listAmountCryptoSymbol,
    listAmountCryptoName: gasListOverride?.listAmountCryptoName,
  };
}

function formatAmount(index: number): string {
  const fiat = resolveDemoAmountRowValues(index).fiatValue.replace(/[^\d.,]/g, '').trim();
  return formatGroupedDecimalAmount(fiat || '128.50');
}

const FEE_RECORD_PLAN_TRANSITIONS = [
  'PlanA -> PlanB',
  'PlanB -> PlanC',
  'Starter -> Pro',
  'Pro -> Enterprise',
] as const;

function resolvePlanTransition(index: number, operationTypeKey: FeeRecordRow['operationTypeKey']) {
  if (!FEE_RECORD_DETAIL_SHOW_PLAN.has(operationTypeKey)) return undefined;
  return FEE_RECORD_PLAN_TRANSITIONS[index % FEE_RECORD_PLAN_TRANSITIONS.length];
}

function resolveOrderNumber(index: number, operationTypeKey: FeeRecordRow['operationTypeKey']) {
  if (!FEE_RECORD_DETAIL_SHOW_ORDER_NUMBER.has(operationTypeKey)) return undefined;
  const part1 = String(20_311_020 + index);
  const part2 = String(82_420_678 + index * 3);
  return `Number_${part1}_${part2}`;
}

/** 上币申请驳回退款 · 详情币种 mock（MNT · Base）。 */
const LISTING_REJECTION_REFUND_DETAIL_CURRENCY: Pick<
  CurrencyRowPreset,
  'symbol' | 'cryptoName' | 'showNetwork' | 'networkLabel'
> = {
  symbol: 'MNT',
  cryptoName: 'eds-mnt-mantle',
  showNetwork: true,
  networkLabel: 'Base',
};

const FEE_RECORD_AML_SERVICE_PROVIDER = 'Elliptic';

const FEE_RECORD_CRYPTO_CARD_LABELS = [
  'Cregis Card · 8826',
  'Cregis Card · 1042',
  'Cregis Card · 5591',
] as const;

function resolveTxHash(index: number, operationTypeKey: FeeRecordRow['operationTypeKey']) {
  const family: CryptoAddressFamily = FEE_RECORD_DETAIL_TRON_FEE_WITH_TX_HASH.has(
    operationTypeKey,
  )
    ? 'trx'
    : 'evm';
  return resolveVerifiedTxHashForRow(index, family);
}

function resolveAmlServiceProvider(operationTypeKey: FeeRecordRow['operationTypeKey']) {
  if (!FEE_RECORD_DETAIL_SHOW_AML_SERVICE_PROVIDER.has(operationTypeKey)) return undefined;
  return FEE_RECORD_AML_SERVICE_PROVIDER;
}

function resolveCryptoCardLabel(index: number, operationTypeKey: FeeRecordRow['operationTypeKey']) {
  if (!FEE_RECORD_DETAIL_SHOW_CRYPTO_CARD.has(operationTypeKey)) return undefined;
  return FEE_RECORD_CRYPTO_CARD_LABELS[index % FEE_RECORD_CRYPTO_CARD_LABELS.length];
}

function resolveDetailCurrency(operationTypeKey: FeeRecordRow['operationTypeKey']) {
  if (!FEE_RECORD_DETAIL_SHOW_CURRENCY.has(operationTypeKey)) {
    return {
      currencySymbol: undefined,
      currencyCryptoName: undefined,
      currencyNetworkLabel: undefined,
      currencyShowNetwork: undefined,
    };
  }
  if (operationTypeKey === 'Listing Application Rejection Refund') {
    const preset = LISTING_REJECTION_REFUND_DETAIL_CURRENCY;
    return {
      currencySymbol: preset.symbol,
      currencyCryptoName: preset.cryptoName,
      currencyNetworkLabel: preset.networkLabel ?? '',
      currencyShowNetwork: preset.showNetwork,
    };
  }
  return {
    currencySymbol: undefined,
    currencyCryptoName: undefined,
    currencyNetworkLabel: undefined,
    currencyShowNetwork: undefined,
  };
}

function buildIntroAccountTransferOutRow(
  index: 0 | 1,
  recordStatusKey: FeeRecordRow['recordStatusKey'],
): FeeRecordRow {
  const amount = index === 0 ? '5,000' : '100.77';
  return {
    id: `fee-${index + 1}`,
    operationTypeKey: 'Account Transfer Out',
    recordStatusKey,
    operatorName: 'Alex Chen',
    transactionTime: formatTransactionTime(index),
    txHash: resolveTxHash(index, 'Account Transfer Out'),
    amount,
    accountKey: 'Team Account',
  };
}

export function buildFeeRecordRow(index: number): FeeRecordRow {
  if (index === 0) {
    return buildIntroAccountTransferOutRow(0, 'Processing');
  }
  if (index === 1) {
    return buildIntroAccountTransferOutRow(1, 'Failed');
  }

  const legacyIndex = resolveLegacyRowIndex(index)!;
  const operationTypeKey = resolveOperationType(legacyIndex);
  const currency = resolveDetailCurrency(operationTypeKey);
  const listAmountAccount = resolveListAmountAccountFields(legacyIndex, operationTypeKey);
  return {
    id: `fee-${index + 1}`,
    operationTypeKey,
    recordStatusKey: 'Completed',
    operatorName: resolveOperatorName(legacyIndex),
    transactionTime: formatTransactionTime(legacyIndex),
    txHash: resolveTxHash(legacyIndex, operationTypeKey),
    ...listAmountAccount,
    planTransition: resolvePlanTransition(legacyIndex, operationTypeKey),
    orderNumber: resolveOrderNumber(legacyIndex, operationTypeKey),
    amlServiceProvider: resolveAmlServiceProvider(operationTypeKey),
    cryptoCardLabel: resolveCryptoCardLabel(legacyIndex, operationTypeKey),
    ...currency,
  };
}

export function buildFeeRecordPageRows(indices: readonly number[]): FeeRecordRow[] {
  return indices.map((index) => buildFeeRecordRow(index));
}
