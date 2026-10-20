import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveSampleAddressForSymbol } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import type { TransactionRecordRow } from './transactionRecordTypes';
import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';

const PARALLEL_OUT_LINE_AMOUNT_VALUES = [
  0.0125,
  0.018,
  0.021,
  0.0095,
  0.033,
  0.0155,
  0.027,
  0.011,
] as const;

const PARALLEL_OUT_LINE_FIAT_VALUES = [
  892.4,
  1284.6,
  1498.2,
  678.9,
  2356.1,
  1107.3,
  1928.5,
  785.2,
] as const;

function resolveParallelOutLineCount(parent: TransactionRecordRow): number {
  const parsed = Number(String(parent.transactionCount).replace(/,/g, ''));
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return parent.symbol === 'BTC' ? 8 : 5;
}

function formatParallelOutLineFiat(value: number): string {
  return `HK$ ${formatGroupedDecimalAmount(String(value))}`;
}

export function buildParallelOutDetailLines(
  parent: TransactionRecordRow,
): TransactionRecordParallelOutDetailLine[] {
  const lineCount = resolveParallelOutLineCount(parent);
  const baseIndex = Number.parseInt(parent.id.replace(/^tx-/, ''), 10) - 1;
  const safeBaseIndex = Number.isFinite(baseIndex) && baseIndex >= 0 ? baseIndex : 0;

  return Array.from({ length: lineCount }, (_, lineIndex) => {
    const amountValue =
      PARALLEL_OUT_LINE_AMOUNT_VALUES[lineIndex % PARALLEL_OUT_LINE_AMOUNT_VALUES.length] ?? 0.01;
    const fiatValue =
      PARALLEL_OUT_LINE_FIAT_VALUES[lineIndex % PARALLEL_OUT_LINE_FIAT_VALUES.length] ?? 100;

    const fromAddress = resolveSampleAddressForSymbol(
      parent.symbol,
      safeBaseIndex * 16 + lineIndex * 2 + 1,
      'btc',
    );
    const toAddress = resolveSampleAddressForSymbol(
      parent.symbol,
      safeBaseIndex * 16 + lineIndex * 2 + 2,
      'btc',
    );

    return {
      id: `${parent.id}-line-${lineIndex + 1}`,
      lineIndex,
      amount: formatGroupedDecimalAmount(String(amountValue)),
      fiatAmount: formatParallelOutLineFiat(fiatValue),
      symbol: parent.symbol,
      cryptoName: parent.cryptoName,
      showNetwork: parent.showNetwork,
      networkLabel: parent.networkLabel,
      transactionType: parent.transactionType,
      fromAlias: parent.fromAlias,
      fromAddress,
      toAddress,
    };
  });
}
