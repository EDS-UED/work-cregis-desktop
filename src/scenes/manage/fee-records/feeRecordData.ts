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

export const FEE_RECORDS_DEMO_TOTAL = 28;

const ACCOUNT_KEYS: readonly FeeRecordAccountKey[] = ['Team Account', 'Gas Account'];

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
  return ACCOUNT_KEYS[index % ACCOUNT_KEYS.length]!;
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

export function buildFeeRecordRow(index: number): FeeRecordRow {
  const operationTypeKey = resolveOperationType(index);
  const currency = resolveDetailCurrency(operationTypeKey);
  return {
    id: `fee-${index + 1}`,
    operationTypeKey,
    operatorName: resolveOperatorName(index),
    transactionTime: formatTransactionTime(index),
    txHash: resolveTxHash(index, operationTypeKey),
    amount: formatAmount(index),
    accountKey: resolveAccountKey(index),
    planTransition: resolvePlanTransition(index, operationTypeKey),
    orderNumber: resolveOrderNumber(index, operationTypeKey),
    amlServiceProvider: resolveAmlServiceProvider(operationTypeKey),
    cryptoCardLabel: resolveCryptoCardLabel(index, operationTypeKey),
    ...currency,
  };
}

export function buildFeeRecordPageRows(indices: readonly number[]): FeeRecordRow[] {
  return indices.map((index) => buildFeeRecordRow(index));
}
