import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
  resolveShowcaseThenCompletedStatus,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineCollectionDetailLineRecord,
  PaymentEngineCollectionDetailRecord,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const COLLECTION_DETAIL_LINE_STATUS_SHOWCASE: readonly PaymentEngineCollectionDetailLineRecord['status'][] = [
  'pending-confirmation',
  'confirming',
  'send-failed',
  'success',
];

const INITIATOR_SAMPLES = ['Ed Stark', 'Alex Mah.', 'Emily Stone'] as const;

const RECEIVING_ALIAS_SAMPLES = ['Mr. Wang', '王总', '昆总'] as const;

function buildCollectionNumber(row: PaymentEngineRecordRow, rowIndex: number): string {
  if (row.collectionId?.trim()) {
    return row.collectionId;
  }
  if (row.ruleNumber?.trim()) {
    return `Number_20251020_${82420678 + rowIndex}`;
  }
  return `Number_20251020_${82420678 + rowIndex}`;
}

function resolveCollectionAmountRangeDisplay(row: PaymentEngineRecordRow): string {
  const value = row.collectionAmountRangeKey?.trim();
  if (!value || value === 'Unlimited') {
    return 'Unlimited';
  }
  return value;
}

function buildCollectedAmount(row: PaymentEngineRecordRow, rowIndex: number): string {
  if (rowIndex === 0) {
    return '10,000,073.3002';
  }
  return formatGroupedDecimalAmount(row.orderAmount);
}

function buildCollectionDetailLines(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineCollectionDetailLineRecord[] {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const symbol = row.currencySymbol ?? row.orderSymbol;
  const addressFamily = symbol === 'TON' ? 'ton' as const : 'evm';

  return Array.from({ length: 4 }, (_, lineIndex) => {
    const status = resolveShowcaseThenCompletedStatus(
      lineIndex,
      COLLECTION_DETAIL_LINE_STATUS_SHOWCASE,
      'success',
    );
    const amountValues = formatGroupedDecimalAmount(
      lineIndex === 0 ? '10000.55567' : `${1000 + lineIndex * 137}.12`,
    );

    return {
      id: `${row.id}-${lineIndex}`,
      amount: amountValues,
      symbol,
      minerFee: lineIndex === 0 ? '0.0003' : '0.0001',
      minerFeeSymbol: symbol,
      address: resolveDemoWalletAddress(rowIndex + lineIndex + 2, preset, 'to'),
      txHash: status === 'success' || status === 'confirming'
        ? resolveVerifiedTxHashForRow(rowIndex * 11 + lineIndex + 90, addressFamily)
        : undefined,
      status,
      timestamp: `2027-10-23 ${String(12 + lineIndex).padStart(2, '0')}:22:54`,
    };
  });
}

function buildCollectionDetailRecord(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineCollectionDetailRecord {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const symbol = row.currencySymbol ?? row.orderSymbol;

  return {
    collectionNumber: buildCollectionNumber(row, rowIndex),
    collectionSymbol: symbol,
    collectionCryptoName: row.currencyCryptoName ?? preset.cryptoName,
    collectionNetworkLabel: row.currencyNetwork ?? preset.networkLabel ?? '',
    collectionAmountRangeKey: resolveCollectionAmountRangeDisplay(row),
    receivingAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(rowIndex + 3, preset, 'to'),
    receivingAlias: RECEIVING_ALIAS_SAMPLES[rowIndex % RECEIVING_ALIAS_SAMPLES.length],
    collectedAmount: buildCollectedAmount(row, rowIndex),
    collectedSymbol: symbol,
    minerFee: rowIndex === 0 ? '0.0086 ETH' : `0.00${3 + rowIndex} ETH`,
    initiatorName: INITIATOR_SAMPLES[rowIndex % INITIATOR_SAMPLES.length],
    progressPercent: rowIndex === 0 ? 39 : 12 + (rowIndex % 8) * 7,
    runningStartedAt: Date.now() - (12 * 3600 + 56 * 60 + 23) * 1000,
    pendingCount: rowIndex === 0 ? '300000' : String(12000 + rowIndex * 500),
    failedCount: rowIndex === 0 ? '2' : String(rowIndex % 4),
    successCount: rowIndex === 0 ? '1000000000' : String(1000000 + rowIndex * 10000),
    recordLines: buildCollectionDetailLines(row, rowIndex),
  };
}

export function enrichPaymentCollectionDetailRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.collectionDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    collectionDetail: buildCollectionDetailRecord(row, rowIndex),
  };
}

export function resolvePaymentCollectionDetailRecord(
  row: PaymentEngineRecordRow,
): PaymentEngineCollectionDetailRecord {
  const enriched = enrichPaymentCollectionDetailRecordForDetail(row);
  return enriched.collectionDetail
    ?? buildCollectionDetailRecord(row, resolveEgDataListDemoRowIndex(row));
}
