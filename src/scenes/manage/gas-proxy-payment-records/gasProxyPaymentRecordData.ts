import { formatGroupedDecimalAmount, formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';
import {
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
  resolveVerifiedTxHashForRow,
} from '@/scenes/shared/egDataListMockData';
import { parseAmountSortValue } from '@/scenes/tasks/tasksDataListSort';
import type { CryptoAddressFamily } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import type {
  GasProxyPaymentAccountKey,
  GasProxyPaymentRecordRow,
  GasProxyPaymentTransactionTypeKey,
  GasProxyTronProxyResources,
} from './gasProxyPaymentRecordTypes';

const GAS_NATIVE_USD_RATES: Record<string, number> = {
  ETH: 3_200,
  BNB: 600,
  POL: 0.45,
  SOL: 180,
};

const INTRO_GAS_NATIVE_AMOUNTS: Partial<Record<GasProxyPaymentAccountKey, string>> = {
  'ETH Gas Account': '8.88',
  'BNB Gas Account': '24.06',
  'POL Gas Account': '32114197.25',
  'SOL Gas Account': '1286.4',
};

export const GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL = 28;

const INTRO_TRANSACTION_TYPE_KEYS: readonly GasProxyPaymentTransactionTypeKey[] = [
  'Collection',
  'Manual Transfer',
  'API Wallet Payout',
  'API Sub-Address Payout',
  'Remittance',
  'EIP-7702 Upgrade',
  'Contract Authorization',
  'Revoke Authorization',
];

const INTRO_ACCOUNT_KEYS: readonly GasProxyPaymentAccountKey[] = [
  'Team Account',
  'ETH Gas Account',
  'BNB Gas Account',
  'POL Gas Account',
  'SOL Gas Account',
];

function formatTransactionTime(index: number): string {
  const day = 23 + (index % 7);
  const hour = 8 + (index % 12);
  const minute = (index * 7) % 60;
  const second = (index * 13) % 60;
  return `2032-10-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

function resolveTransactionType(index: number): GasProxyPaymentTransactionTypeKey {
  if (index < INTRO_TRANSACTION_TYPE_KEYS.length) {
    return INTRO_TRANSACTION_TYPE_KEYS[index]!;
  }
  return 'Collection';
}

function resolveAccountKey(index: number): GasProxyPaymentAccountKey {
  if (index < INTRO_ACCOUNT_KEYS.length) {
    return INTRO_ACCOUNT_KEYS[index]!;
  }
  return 'Team Account';
}

function formatDeductedAmount(index: number): string {
  const crypto = resolveDemoAmountRowValues(index).cryptoValue.replace(/[^\d.,]/g, '').trim();
  return formatGroupedDecimalAmount(crypto || '0.001248');
}

function resolveDeductedAmountUsd(index: number): number {
  const fiat = resolveDemoAmountRowValues(index).fiatValue.replace(/[^\d.,]/g, '').trim();
  return parseAmountSortValue(fiat || '12.48');
}

function formatDeductedAmountFiatDisplay(index: number): string {
  const usd = resolveDeductedAmountUsd(index);
  const [whole = '0', fraction = '00'] = usd.toFixed(2).split('.');
  return `$${formatGroupedDecimalAmount(whole)}.${fraction}`;
}

function resolveGasNativeDeductedAmount(
  index: number,
  accountKey: GasProxyPaymentAccountKey,
): string {
  const preset = INTRO_GAS_NATIVE_AMOUNTS[accountKey];
  if (preset) return formatGroupedTrimmedAmount(preset);

  const symbol =
    accountKey === 'ETH Gas Account'
      ? 'ETH'
      : accountKey === 'BNB Gas Account'
        ? 'BNB'
        : accountKey === 'POL Gas Account'
          ? 'POL'
          : accountKey === 'SOL Gas Account'
            ? 'SOL'
            : 'ETH';
  const usd = resolveDeductedAmountUsd(index);
  const rate = GAS_NATIVE_USD_RATES[symbol] ?? 1;
  const native = usd / rate;
  return formatGroupedTrimmedAmount(String(native));
}

function resolveAddressFamily(symbol: string): CryptoAddressFamily {
  if (symbol === 'BTC') return 'btc';
  if (symbol === 'TRX') return 'trx';
  if (symbol === 'SOL') return 'sol';
  return 'evm';
}

function resolveTronProxyResources(index: number): GasProxyTronProxyResources | undefined {
  const variant = index % 6;
  if (variant === 0) {
    return {
      bandwidthTrx: formatGroupedDecimalAmount('12.5'),
      energyTrx: formatGroupedDecimalAmount('48'),
      addressActivationTrx: formatGroupedDecimalAmount('1.1'),
    };
  }
  if (variant === 1) {
    return { bandwidthTrx: formatGroupedDecimalAmount('6.2') };
  }
  if (variant === 2) {
    return { energyTrx: formatGroupedDecimalAmount('32') };
  }
  if (variant === 3) {
    return { addressActivationTrx: formatGroupedDecimalAmount('1.1') };
  }
  if (variant === 4) {
    return {
      bandwidthTrx: formatGroupedDecimalAmount('9.8'),
      energyTrx: formatGroupedDecimalAmount('21'),
    };
  }
  return undefined;
}

export function buildGasProxyPaymentRecordRow(index: number): GasProxyPaymentRecordRow {
  const preset = resolveCurrencyRowPreset(index);
  const addressFamily = resolveAddressFamily(preset.symbol);
  const isTronNetwork = preset.symbol === 'TRX';
  const accountKey = resolveAccountKey(index);

  return {
    id: `gas-proxy-${index + 1}`,
    symbol: preset.symbol,
    cryptoName: preset.cryptoName,
    showNetwork: preset.showNetwork,
    networkLabel: preset.networkLabel ?? '',
    transactionTypeKey: resolveTransactionType(index),
    txHash: resolveVerifiedTxHashForRow(index, addressFamily),
    transactionTime: formatTransactionTime(index),
    deductedAmount: formatDeductedAmount(index),
    deductedAmountUsd: resolveDeductedAmountUsd(index),
    deductedAmountFiatDisplay: formatDeductedAmountFiatDisplay(index),
    deductedAmountGasNative: resolveGasNativeDeductedAmount(index, accountKey),
    accountKey,
    isTronNetwork,
    tronProxyResources: isTronNetwork ? resolveTronProxyResources(index) : undefined,
  };
}

export function buildGasProxyPaymentRecordPageRows(
  indices: readonly number[],
): GasProxyPaymentRecordRow[] {
  return indices.map((index) => buildGasProxyPaymentRecordRow(index));
}

export function parseRowIndexFromGasProxyPaymentRecordId(id: string): number {
  const match = /^gas-proxy-(\d+)$/.exec(String(id).trim());
  if (!match) return 0;
  const parsed = Number.parseInt(match[1] ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed - 1;
}
