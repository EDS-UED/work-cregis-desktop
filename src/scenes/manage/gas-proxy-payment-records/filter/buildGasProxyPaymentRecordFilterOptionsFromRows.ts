import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildDataListCurrencyFilterOptionsFromRows } from '@/scenes/shared/buildDataListCurrencyFilterOptionsFromRows';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL,
  buildGasProxyPaymentRecordRow,
} from '../gasProxyPaymentRecordData';
import type {
  GasProxyPaymentAccountKey,
  GasProxyPaymentTransactionTypeKey,
} from '../gasProxyPaymentRecordTypes';

const GAS_PROXY_TRANSACTION_TYPE_KEYS: readonly GasProxyPaymentTransactionTypeKey[] = [
  'Collection',
  'Manual Transfer',
  'API Wallet Payout',
  'API Sub-Address Payout',
  'Remittance',
  'EIP-7702 Upgrade',
  'Contract Authorization',
  'Revoke Authorization',
];

const GAS_PROXY_ACCOUNT_KEYS: readonly GasProxyPaymentAccountKey[] = [
  'Team Account',
  'ETH Gas Account',
  'BNB Gas Account',
  'POL Gas Account',
  'SOL Gas Account',
];

export type GasProxyPaymentRecordFilterRowOptions = {
  currencyOptions: EgFilterFieldCurrencyOption[];
  transactionTypeOptions: EgFilterFieldDropdownOption[];
  deductedAccountOptions: EgFilterFieldDropdownOption[];
};

function adaptRowForCurrencyFilter(
  row: ReturnType<typeof buildGasProxyPaymentRecordRow>,
): PaymentEngineRecordRow {
  return {
    currencySymbol: row.symbol,
    currencyCryptoName: row.cryptoName,
    currencyShowNetwork: row.showNetwork,
    currencyNetwork: row.networkLabel,
    networkLabel: row.networkLabel,
    orderSymbol: row.symbol,
  } as PaymentEngineRecordRow;
}

export function buildGasProxyPaymentRecordFilterOptionsFromRows(
  translate: (catalogKey: string) => string,
  rowCount = GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL,
): GasProxyPaymentRecordFilterRowOptions {
  const safeRowCount = Math.max(0, rowCount);
  const currencyRows: PaymentEngineRecordRow[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    currencyRows.push(adaptRowForCurrencyFilter(buildGasProxyPaymentRecordRow(rowIndex)));
  }

  return {
    currencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      currencyRows,
      (row) => row.currencySymbol ?? row.orderSymbol,
    ),
    transactionTypeOptions: GAS_PROXY_TRANSACTION_TYPE_KEYS.map((key) => ({
      id: resolveDataListFilterOptionId('gas-proxy-tx-type', key),
      label: translate(key),
    })),
    deductedAccountOptions: GAS_PROXY_ACCOUNT_KEYS.map((key) => ({
      id: resolveDataListFilterOptionId('gas-proxy-deducted-account', key),
      label: translate(key),
    })),
  };
}
