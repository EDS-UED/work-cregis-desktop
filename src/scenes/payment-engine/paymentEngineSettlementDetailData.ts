import {
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { formatGroupedDecimalAmount, formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import type {
  PaymentEngineRecordRow,
  PaymentEngineSettlementRecordDetail,
} from './paymentEngineRecordConfigs';

function buildSettlementRecordDetail(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineSettlementRecordDetail {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const amountRow = resolveDemoAmountRowValues(rowIndex);
  const paymentCount = 48 + rowIndex * 7;
  const feeBase = 0.125 + (rowIndex % 5) * 0.025;

  return {
    successfulPaymentCount: formatGroupedNumber(paymentCount),
    totalTransactionAmount: amountRow.cryptoValue,
    totalTransactionSymbol: row.orderSymbol,
    totalFee: formatGroupedDecimalAmount(feeBase.toFixed(4)),
    totalFeeSymbol: row.orderSymbol,
    settlementAddress: resolveDemoWalletAddress(rowIndex, preset, 'to'),
  };
}

export function enrichPaymentSettlementRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  if (row.settlementRecordDetail) {
    return row;
  }

  return {
    ...row,
    settlementRecordDetail: buildSettlementRecordDetail(
      row,
      resolveEgDataListDemoRowIndex(row),
    ),
  };
}

export function resolvePaymentSettlementRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineSettlementRecordDetail {
  const enriched = enrichPaymentSettlementRecordForDetail(row);
  return enriched.settlementRecordDetail
    ?? buildSettlementRecordDetail(row, resolveEgDataListDemoRowIndex(row));
}
