import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';

export function buildParallelOutDetailAmountCustomize(
  line: TransactionRecordParallelOutDetailLine,
): Record<string, unknown> {
  return {
    amountType: 'conversion',
    cryptoValue: line.amount,
    cryptoSymbol: line.symbol,
    fiatValue: line.fiatAmount,
    showCryptoIcon: false,
    alignEnd: false,
    tooltipTrigger: 'hover',
  };
}

export function buildParallelOutDetailSenderCustomize(
  line: TransactionRecordParallelOutDetailLine,
): Record<string, unknown> {
  return {
    fromAlias1: line.fromAlias,
    fromAddress1: line.fromAddress,
    fromAddressCount: '1',
    addressTooltipTrigger: 'hover',
  };
}

export function buildParallelOutDetailReceiverCustomize(
  line: TransactionRecordParallelOutDetailLine,
): Record<string, unknown> {
  return {
    toAddress1: line.toAddress,
    toAddressCount: '1',
    addressTooltipTrigger: 'hover',
  };
}
