import {
  formatGroupedAmountText,
  formatGroupedNumber,
} from '@/utils/formatGroupedDisplay';
import {
  isTransactionRecordCollectionDetailType,
  isTransactionRecordTransferOutDetailType,
  TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION,
  TRANSACTION_RECORD_DETAIL_PARALLEL_OUT,
} from './transactionRecordDetailTypes';
import type { CryptoAddressFamily } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { resolveSampleAddressForSymbol, resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import {
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
} from '@/scenes/shared/egDataListMockData';
import type { CurrencyRowPreset } from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowPresets';
import type { TransactionRecordDirection, TransactionRecordRow } from './transactionRecordTypes';

/** 交易记录演示数据条数（与 EgDataList 首屏可见行数一致，避免空白占位行）。 */
export const TRANSACTION_RECORDS_DEMO_TOTAL = 28;

/** 演示交易类型全集；前 N 行按序展示，其余行按 index 伪随机（刷新稳定）。 */
const TRANSACTION_TYPES = [
  '钱包人工转出',
  'API申请转出',
  '归集转出',
  '归集转入',
  '矿工费（归集）转出',
  '矿工费（归集）转入',
  '普通转入',
  '链上操作',
  '矿工费代付',
  '并行转出',
] as const;

const SECONDARY_WALLET_NAMES = [
  'Main Vault',
  'Operations',
  'Compliance',
] as const;

const FROM_ALIASES = ['laocl', 'ops', 'treasury', 'vault'] as const;

/** 演示数据内可查看的团队钱包（与所属钱包列取值一致）。 */
export const TRANSACTION_RECORDS_DEMO_WALLET_NAMES = [
  'test_single_1',
  ...SECONDARY_WALLET_NAMES,
] as const;

function formatDemoAmount(index: number): string {
  return resolveDemoAmountRowValues(index).cryptoValue;
}

function formatDemoFiat(index: number): string {
  return resolveDemoAmountRowValues(index).fiatValue;
}

function resolveTransactionType(index: number): string {
  if (index < TRANSACTION_TYPES.length) {
    return TRANSACTION_TYPES[index]!;
  }
  const seed = (index + 1) * 7919;
  return TRANSACTION_TYPES[seed % TRANSACTION_TYPES.length]!;
}

function resolveTransactionDirection(transactionType: string): TransactionRecordDirection {
  if (transactionType.includes('转入')) {
    return 'in';
  }
  return 'out';
}

function formatTransactionDirectionLabel(direction: TransactionRecordDirection): string {
  return direction === 'in' ? '转入' : '转出';
}

function formatDemoTimestamp(offsetMs: number): string {
  const baseMs = Date.parse('2026-09-15T20:45:06');
  const date = new Date(baseMs - offsetMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function resolveTransactionTimeOffset(index: number): number {
  return index * 37 * 60 * 1000 + (index % 17) * 1000;
}

function formatTransactionTime(index: number): string {
  return formatDemoTimestamp(resolveTransactionTimeOffset(index));
}

function formatCreatedTime(index: number): string {
  return formatDemoTimestamp(resolveTransactionTimeOffset(index) + 12 * 60 * 1000);
}

const MINER_FEE_AMOUNTS = ['0.00266', '0.0002198', '0.000812'] as const;

function resolveMinerFeeDisplay(index: number, symbol: string): string {
  const amount = MINER_FEE_AMOUNTS[index % MINER_FEE_AMOUNTS.length] ?? MINER_FEE_AMOUNTS[0];
  return formatGroupedAmountText(`${amount} ${symbol} ≈ $1.87`);
}

/** 演示并行转出 + BTC + 8 笔明细链接（0-based rowIndex 9 → tx-10）。 */
export const TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX = 9;

const TRANSACTION_RECORD_PARALLEL_OUT_BTC_ROW_INDEX =
  TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX;

const TRANSACTION_RECORD_PARALLEL_OUT_BTC_PRESET: CurrencyRowPreset = {
  symbol: 'BTC',
  cryptoName: 'eds-btc-bitcoin',
  showNetwork: false,
  addressFamily: 'btc',
};

function resolveTransactionRecordCurrencyPreset(index: number): CurrencyRowPreset {
  if (index === TRANSACTION_RECORD_PARALLEL_OUT_BTC_ROW_INDEX) {
    return TRANSACTION_RECORD_PARALLEL_OUT_BTC_PRESET;
  }
  return resolveCurrencyRowPreset(index);
}

function resolveTransactionCount(transactionType: string, symbol: string): string {
  if (
    isTransactionRecordCollectionDetailType(transactionType)
    || transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION
  ) {
    return formatGroupedNumber(3);
  }
  if (transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT) {
    return symbol === 'BTC' ? formatGroupedNumber(8) : formatGroupedNumber(5);
  }
  return formatGroupedNumber(1);
}

const INITIATOR_DISPLAYS = [
  'Treasury (t******y@cregis.com)',
  'Name (t******c@gmail.com)',
  'Ops Team (o******s@cregis.com)',
] as const;

const SIGNER_DISPLAYS = ['Ethan Davis', 'Jordan Lee', 'Taylor Reed'] as const;

function resolveInitiatorDisplay(index: number): string {
  return INITIATOR_DISPLAYS[index % INITIATOR_DISPLAYS.length]!;
}

function resolveSignerDisplay(index: number): string {
  return SIGNER_DISPLAYS[index % SIGNER_DISPLAYS.length]!;
}

function resolveCollectionNumber(index: number): string {
  const day = 20260915 + (index % 7);
  const serial = String(100001 + index).padStart(6, '0');
  return `COL-${day}-${serial}`;
}

function resolveThirdPartyRef(index: number): string {
  return `Coinbase_order_${800389028 + index}`;
}

const MANUAL_WALLET_REMARKS = [
  'Payroll batch payout',
  'Vendor settlement',
  '',
] as const;

function resolveManualWalletRemark(index: number): string {
  return MANUAL_WALLET_REMARKS[index % MANUAL_WALLET_REMARKS.length] ?? '';
}

function resolveWalletName(index: number): string {
  if (index % 4 !== 3) {
    return TRANSACTION_RECORDS_DEMO_WALLET_NAMES[0];
  }
  return SECONDARY_WALLET_NAMES[index % SECONDARY_WALLET_NAMES.length]!;
}

function resolveFromAlias(index: number): string {
  return FROM_ALIASES[index % FROM_ALIASES.length]!;
}

function resolveTransactionHash(index: number, addressFamily?: CryptoAddressFamily): string {
  return resolveVerifiedTxHashForRow(index, addressFamily ?? 'evm');
}

export function buildTransactionRecordRow(index: number): TransactionRecordRow {
  const transactionType = resolveTransactionType(index);
  const direction = resolveTransactionDirection(transactionType);
  const preset = resolveTransactionRecordCurrencyPreset(index);
  const fromAddress = resolveSampleAddressForSymbol(
    preset.symbol,
    index * 2 + 1,
    preset.addressFamily,
  );
  const toAddress = resolveSampleAddressForSymbol(
    preset.symbol,
    index * 2 + 2,
    preset.addressFamily,
  );

  const detailFields =
    isTransactionRecordTransferOutDetailType(transactionType)
      ? {
          thirdPartyRef: resolveThirdPartyRef(index),
          initiatorDisplay: resolveInitiatorDisplay(index),
          signerDisplay: resolveSignerDisplay(index),
          remark: resolveManualWalletRemark(index),
        }
      : transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION
        ? {
            signerDisplay: resolveSignerDisplay(index),
            collectionNumber: resolveCollectionNumber(index),
          }
        : transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT
          ? {
              signerDisplay: resolveSignerDisplay(index),
            }
          : isTransactionRecordCollectionDetailType(transactionType)
          ? {
              collectionNumber: resolveCollectionNumber(index),
            }
          : {};

  return {
    id: `tx-${index + 1}`,
    createdTime: formatCreatedTime(index),
    transactionTime: formatTransactionTime(index),
    symbol: preset.symbol,
    cryptoName: preset.cryptoName,
    showNetwork: preset.showNetwork,
    networkLabel: preset.networkLabel ?? '',
    fromAlias: resolveFromAlias(index),
    fromAddress,
    toAddress,
    txHash: resolveTransactionHash(index, preset.addressFamily),
    walletName: resolveWalletName(index),
    transactionType,
    directionLabel: formatTransactionDirectionLabel(direction),
    transactionCount: resolveTransactionCount(transactionType, preset.symbol),
    transactionCountShowsDetailLink:
      transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT
      && preset.symbol === 'BTC',
    minerFeeDisplay: resolveMinerFeeDisplay(index, preset.symbol),
    ...detailFields,
    amount: formatDemoAmount(index),
    fiatAmount: formatDemoFiat(index),
  };
}

export function buildTransactionRecordPageRows(
  indices: readonly number[],
): TransactionRecordRow[] {
  return indices.map((index) => buildTransactionRecordRow(index));
}
