import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import type { GasProxyPaymentRecordRow } from '../gasProxyPaymentRecordTypes';

export function buildGasProxyPaymentRecordFilterRowSnapshot(
  row: GasProxyPaymentRecordRow,
): EgFilterRowSnapshot {
  return {
    gasProxyCurrency: row.symbol,
    gasProxyCurrencySymbol: row.symbol,
    gasProxyCurrencyNetwork: row.networkLabel.trim(),
    gasProxyTransactionType: resolveDataListFilterOptionId(
      'gas-proxy-tx-type',
      row.transactionTypeKey,
    ),
    gasProxyTxHash: row.txHash,
    gasProxyDeductedAccount: resolveDataListFilterOptionId(
      'gas-proxy-deducted-account',
      row.accountKey,
    ),
    gasProxyTransactionTime: row.transactionTime,
  };
}
