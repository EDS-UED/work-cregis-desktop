import {
  buildDemoHexRecordId,
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
  resolveShowcaseThenCompletedStatus,
} from '@/scenes/shared/egDataListMockData';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import type {
  PaymentEngineBulkTransferDetailRecord,
  PaymentEngineBulkTransferLineRecord,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';

const BULK_TRANSFER_LINE_STATUS_SHOWCASE: readonly PaymentEngineBulkTransferLineRecord['status'][] = [
  'pending',
  'success',
  'failed',
];

function resolveBulkTransferLineCount(rowIndex: number): number {
  if (rowIndex % 7 === 0) {
    return 28;
  }
  if (rowIndex % 5 === 0) {
    return 3;
  }
  return 1;
}

function buildBulkTransferLineRecords(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineBulkTransferLineRecord[] {
  const lineCount = resolveBulkTransferLineCount(rowIndex);
  const networkLabel = row.currencyNetwork ?? row.networkLabel;
  const addressFamily = row.currencySymbol === 'TON' ? 'ton' as const : undefined;

  return Array.from({ length: lineCount }, (_, lineIndex) => {
    const status = resolveShowcaseThenCompletedStatus(
      lineIndex,
      BULK_TRANSFER_LINE_STATUS_SHOWCASE,
      'success',
    );

    const amount = lineIndex === 0
      ? row.orderAmount
      : `${(Number.parseFloat(row.orderAmount.replace(/,/g, '')) / (lineIndex + 1)).toFixed(2)}`;

    return {
      transferId: String(1465911134958241 + lineIndex),
      amount,
      symbol: row.orderSymbol,
      networkLabel,
      txHash: resolveVerifiedTxHashForRow(rowIndex * 17 + lineIndex, addressFamily),
      senderAddress: row.walletFromAddress ?? buildDemoHexRecordId(rowIndex + lineIndex),
      status,
      blockTimestamp: `2032-10-23 ${String(12 + lineIndex).padStart(2, '0')}:22:54`,
    };
  });
}

export function enrichPaymentBulkTransferRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.bulkTransferDetail) {
    return row;
  }

  const rowIndex = resolveEgDataListDemoRowIndex(row);
  const preset = resolveCurrencyRowPreset(rowIndex);
  const recipientAddress =
    row.walletToAddress ?? resolveDemoWalletAddress(rowIndex, preset, 'to');

  return {
    ...row,
    bulkTransferDetail: {
      recipientAddress,
      transferLines: buildBulkTransferLineRecords(row, rowIndex),
    },
  };
}

export function resolvePaymentBulkTransferDetailRecord(
  row: PaymentEngineRecordRow,
): PaymentEngineBulkTransferDetailRecord {
  const enriched = enrichPaymentBulkTransferRecordForDetail(row);
  return enriched.bulkTransferDetail ?? {
    recipientAddress: '',
    transferLines: [],
  };
}
