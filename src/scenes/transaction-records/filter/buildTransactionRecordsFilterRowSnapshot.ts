import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import type { TransactionRecordRow } from '../transactionRecordTypes';

function joinSearchParts(values: Array<string | undefined>): string {
  return values
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

export function buildTransactionRecordsFilterRowSnapshot(
  row: TransactionRecordRow,
): EgFilterRowSnapshot {
  return {
    wallet: row.walletName,
    currency: row.symbol,
    currencySymbol: row.symbol,
    currencyNetwork: row.networkLabel.trim(),
    transactionTime: row.transactionTime,
    incomeExpenseType: row.directionLabel.trim()
      ? resolveDataListFilterOptionId('tx-records-income-expense', row.directionLabel)
      : undefined,
    transactionType: row.transactionType.trim()
      ? resolveDataListFilterOptionId('tx-records-tx-type', row.transactionType)
      : undefined,
    txHash: row.txHash,
    paymentAddress: joinSearchParts([row.fromAddress, row.fromAlias]),
    receivingAddress: joinSearchParts([row.toAddress, row.toAlias]),
  };
}
