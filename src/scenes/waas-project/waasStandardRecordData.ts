import {
  buildDemoHexRecordId,
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
  resolveDemoWalletAddress,
  resolveShowcaseThenCompletedStatus,
} from '@/scenes/shared/egDataListMockData';
import {
  resolveSampleAddressForSymbol,
  resolveAddressFamily,
  sideAddressPoolIndex,
} from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import {
  buildPaymentEngineRecordRows,
  PAYMENT_ENGINE_RECORD_ROW_COUNT,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  WAAS_SUB_ADDRESS_DEFAULT_SELECTION,
  resolveWaasSubAddressCurrencyPresetFromSelection,
  type WaasSubAddressCurrencySelection,
} from './waasSubAddressCurrencyPickerData';

const TASK_RECORD_SHOWCASE = {
  amount: '1.66',
  count: '30',
  startAt: '2026-08-27 21:24:47',
  endAt: '2026-08-27 21:29:00',
} as const;

const TASK_COLLECTION_NUMBER_BASE = 1464590243540288n;

function resolveTaskCollectionNumber(rowIndex: number): string {
  return `GJ${TASK_COLLECTION_NUMBER_BASE + BigInt(rowIndex)}`;
}

const API_COLLECTION_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'external-pending',
  'signed-pending-confirmation',
  'approving',
  'signature-pending',
  'transaction-failed',
  'rejected',
  'completed',
];
/** 任务记录：前 2 行依次展示完整状态；第 3 行起均为已结束。 */
const TASK_RECORD_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'pending',
  'completed',
];
const COLLECTION_HISTORY_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'failed',
  'cancelled',
  'success',
];

/** 交易历史：前 3 行依次展示失败 / 已取消 / 成功；第 4 行起均为成功。 */
const TRANSACTION_HISTORY_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'failed',
  'cancelled',
  'success',
];

const COLLECTION_HISTORY_BUSINESS_TYPE_SHOWCASE = [
  'Collection',
  'Gas Fee Top-up',
  'Gas Fee Top-up',
] as const;

const SUB_ADDRESS_TAG_SHOWCASE = ['Mr. Wang', '王总', '昆总'] as const;

const TRANSACTION_AMOUNT_SHOWCASE = [
  '100000000',
  '0.07782',
  '2.000062',
  '18112.82',
  '3605298.721',
  '3082.7192',
  '102295757',
  '0.003208',
] as const;

const PAYOUT_TYPE_SHOWCASE = ['API', 'Manual Operation'] as const;

/** 钱包 / 子地址提币：前 7 行依次展示完整状态；第 8 行起均为已完成。 */
const WALLET_PAYOUT_STATUS_SHOWCASE: readonly PaymentEngineRecordRow['status'][] = [
  'external-pending',
  'approving',
  'signature-pending',
  'signed-pending-confirmation',
  'transaction-failed',
  'rejected',
  'completed',
];

const PAYOUT_TO_ALIAS_SHOWCASE: Partial<Record<number, string>> = {
  1: '王总',
  3: 'Binance. User',
  4: 'Gate. Withdraw',
};

const RULE_NAME_SHOWCASE = [
  'Daily',
  'Auto Collect',
  'Threshold',
  'Gas Pool',
  'Vault Sweep',
  'Hot Wallet',
  'Reserve',
  'Cold Route',
] as const;

const RULE_NAME_POOL = [
  ...RULE_NAME_SHOWCASE,
  'Treasury',
  'Ops Pool',
  'Vendor Settle',
  'Compliance',
  'Liquidity',
  'APAC Collect',
  'EMEA Sweep',
  'Client Dep',
  'Night Batch',
  'Weekend',
] as const;

function seededFraction(rowIndex: number, salt: number): number {
  const x = Math.sin((rowIndex + 1) * 9973 + salt * 7919) * 10000;
  return x - Math.floor(x);
}

function resolveDemoRuleName(rowIndex: number): string {
  if (rowIndex < RULE_NAME_SHOWCASE.length) {
    return RULE_NAME_SHOWCASE[rowIndex]!;
  }
  const index = Math.floor(seededFraction(rowIndex, 61) * RULE_NAME_POOL.length);
  return RULE_NAME_POOL[index] ?? RULE_NAME_POOL[0];
}

const DEMO_LIST_DATETIME = '2027-10-23 12:22:54';

function offsetDateTime(base: string, rowIndex: number): string {
  const [date, time] = base.split(' ');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + rowIndex;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;
  return `${date} ${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function buildRowCurrencyBase(rowIndex: number): Pick<
  PaymentEngineRecordRow,
  | 'currencySymbol'
  | 'currencyNetwork'
  | 'currencyShowNetwork'
  | 'currencyCryptoName'
  | 'orderSymbol'
  | 'networkLabel'
  | 'receivedSymbol'
> {
  const preset = resolveCurrencyRowPreset(rowIndex);
  return {
    currencySymbol: preset.symbol,
    currencyNetwork: preset.networkLabel ?? '',
    currencyShowNetwork: preset.showNetwork,
    currencyCryptoName: preset.cryptoName,
    orderSymbol: preset.symbol,
    networkLabel: preset.networkLabel ?? '',
    receivedSymbol: preset.symbol,
  };
}

function buildCryptoAddressRowBase(rowIndex: number) {
  const preset = resolveCurrencyRowPreset(rowIndex);
  return {
    ...buildRowCurrencyBase(rowIndex),
    walletFromAddress: resolveDemoWalletAddress(rowIndex, preset, 'from'),
    walletToAddress: resolveDemoWalletAddress(rowIndex, preset, 'to'),
    walletToAlias:
      rowIndex === 4 && preset.symbol === 'MNT' ? 'Coinbase Deposit 3' : undefined,
  };
}

function buildSubAddressRow(
  rowIndex: number,
  currency: WaasSubAddressCurrencySelection = WAAS_SUB_ADDRESS_DEFAULT_SELECTION,
): PaymentEngineRecordRow {
  const preset = resolveWaasSubAddressCurrencyPresetFromSelection(currency);
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const addressFamily = preset.addressFamily ?? resolveAddressFamily(currency.symbol);
  const address = resolveSampleAddressForSymbol(
    currency.symbol,
    sideAddressPoolIndex('from', rowIndex + 1),
    addressFamily,
  );
  const balance =
    rowIndex === 0 ? '1.003208' : formatGroupedDecimalAmount(amountValues.cryptoValue);
  const tagLabel = SUB_ADDRESS_TAG_SHOWCASE[rowIndex];

  return {
    id: buildDemoHexRecordId(rowIndex, 800),
    merchantOrderId: buildDemoHexRecordId(rowIndex, 801),
    status: 'success',
    createdAt: DEMO_LIST_DATETIME,
    receivedAmount: balance,
    receivedSymbol: currency.symbol,
    orderAmount: balance,
    orderSymbol: currency.symbol,
    currencySymbol: currency.symbol,
    currencyCryptoName: currency.cryptoName,
    currencyShowNetwork: Boolean(currency.networkLabel),
    currencyNetwork: currency.networkLabel,
    networkLabel: currency.networkLabel,
    walletFromAddress: address,
    walletFromAlias: tagLabel,
    subAddressBalance: balance,
    callbackUrl: 'https://callback_url.com',
  };
}

function buildPayoutRecordRow(
  menuItem: 'Wallet Payout' | 'Sub-Address Payout',
  rowIndex: number,
): PaymentEngineRecordRow {
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const amount =
    rowIndex < TRANSACTION_AMOUNT_SHOWCASE.length
      ? TRANSACTION_AMOUNT_SHOWCASE[rowIndex]!
      : amountValues.cryptoValue;
  const status = resolveShowcaseThenCompletedStatus(
    rowIndex,
    WALLET_PAYOUT_STATUS_SHOWCASE,
    'completed',
  );
  const prefix = menuItem === 'Wallet Payout' ? 'WP' : 'SAP';

  return {
    ...buildCryptoAddressRowBase(rowIndex),
    id: `${prefix}-${88001 + rowIndex}`,
    merchantOrderId: buildDemoHexRecordId(rowIndex, 810),
    status,
    createdAt: DEMO_LIST_DATETIME,
    receivedAmount: amount,
    orderAmount: amount,
    orderFiat: amountValues.fiatValue,
    payoutTypeKey: PAYOUT_TYPE_SHOWCASE[rowIndex % PAYOUT_TYPE_SHOWCASE.length],
    walletToAlias: PAYOUT_TO_ALIAS_SHOWCASE[rowIndex],
    transactionTypeKey: 'Send',
  };
}

function buildTransactionHistoryRow(rowIndex: number): PaymentEngineRecordRow {
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const amount =
    rowIndex < TRANSACTION_AMOUNT_SHOWCASE.length
      ? TRANSACTION_AMOUNT_SHOWCASE[rowIndex]!
      : amountValues.cryptoValue;

  return {
    ...buildCryptoAddressRowBase(rowIndex),
    id: buildDemoHexRecordId(rowIndex, 820),
    merchantOrderId: buildDemoHexRecordId(rowIndex, 821),
    status: resolveShowcaseThenCompletedStatus(
      rowIndex,
      TRANSACTION_HISTORY_STATUS_SHOWCASE,
      'success',
    ),
    businessTypeKey: resolveShowcaseThenCompletedStatus(
      rowIndex,
      COLLECTION_HISTORY_BUSINESS_TYPE_SHOWCASE,
      'Collection',
    ),
    collectionId: resolveTaskCollectionNumber(rowIndex),
    createdAt: DEMO_LIST_DATETIME,
    receivedAmount: amount,
    orderAmount: amount,
    orderFiat: amountValues.fiatValue,
    transactionTypeKey: rowIndex === 0 ? 'Send' : 'Deposit',
  };
}

function buildTransactionProcessingRow(rowIndex: number): PaymentEngineRecordRow {
  return {
    ...buildTransactionHistoryRow(rowIndex),
    status: 'pending',
  };
}

function buildCollectionProcessingRow(rowIndex: number): PaymentEngineRecordRow {
  return {
    ...buildCollectionHistoryRow(rowIndex),
    status: 'pending',
  };
}

function resolveDemoCollectionAmountRange(rowIndex: number): string {
  if (seededFraction(rowIndex, 73) < 0.5) return 'Unlimited';
  const minValues = resolveDemoAmountRowValues(rowIndex);
  const maxValues = resolveDemoAmountRowValues(rowIndex + 5);
  return `${formatGroupedDecimalAmount(minValues.cryptoValue)}～${formatGroupedDecimalAmount(maxValues.cryptoValue)}`;
}

function buildRuleConfigurationRow(rowIndex: number): PaymentEngineRecordRow {
  const ruleNumber =
    rowIndex === 0
      ? 'CO1463926806912640'
      : `CO1463926806912${String(640 + rowIndex).padStart(3, '0')}`;

  return {
    ...buildRowCurrencyBase(rowIndex),
    id: ruleNumber,
    merchantOrderId: ruleNumber,
    status: 'success',
    createdAt:
      rowIndex === 0
        ? '2026-08-18 12:27:08'
        : offsetDateTime('2026-08-18 12:27:08', rowIndex),
    receivedAmount: '0',
    orderAmount: '0',
    ruleName: resolveDemoRuleName(rowIndex),
    ruleNumber,
    collectionAmountRangeKey: resolveDemoCollectionAmountRange(rowIndex),
    ruleEnabled: rowIndex === 1 || rowIndex === 2 || rowIndex === 5,
  };
}

function buildTaskRecordRow(rowIndex: number): PaymentEngineRecordRow {
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const collectionId = resolveTaskCollectionNumber(rowIndex);
  const preset = resolveCurrencyRowPreset(rowIndex);

  return {
    ...buildRowCurrencyBase(rowIndex),
    walletFromAddress: resolveDemoWalletAddress(rowIndex, preset, 'from'),
    walletToAddress: resolveDemoWalletAddress(rowIndex, preset, 'to'),
    id: collectionId,
    merchantOrderId: collectionId,
    status: resolveShowcaseThenCompletedStatus(
      rowIndex,
      TASK_RECORD_STATUS_SHOWCASE,
      'completed',
    ),
    createdAt:
      rowIndex === 0
        ? TASK_RECORD_SHOWCASE.startAt
        : offsetDateTime('2026-08-27 21:24:47', rowIndex),
    receivedAmount: '0',
    orderAmount: rowIndex === 0 ? TASK_RECORD_SHOWCASE.amount : amountValues.cryptoValue,
    collectionId,
    taskStartAt:
      rowIndex === 0
        ? TASK_RECORD_SHOWCASE.startAt
        : offsetDateTime('2026-08-27 21:24:47', rowIndex),
    taskEndAt:
      rowIndex === 0
        ? TASK_RECORD_SHOWCASE.endAt
        : offsetDateTime('2026-08-27 21:29:00', rowIndex + 5),
    taskTransactionCount: rowIndex === 0 ? TASK_RECORD_SHOWCASE.count : String(28 + rowIndex),
    ruleName: resolveDemoRuleName(rowIndex),
    ruleNumber:
      rowIndex === 0
        ? 'CO1463926806912640'
        : `CO1463926806912${String(640 + rowIndex).padStart(3, '0')}`,
  };
}

function buildApiCollectionRow(rowIndex: number): PaymentEngineRecordRow {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const fromAddress = resolveDemoWalletAddress(rowIndex, preset, 'from');
  const toAddress = resolveDemoWalletAddress(rowIndex, preset, 'to');
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const recordId = buildDemoHexRecordId(rowIndex, 920);
  const status = resolveShowcaseThenCompletedStatus(
    rowIndex,
    API_COLLECTION_STATUS_SHOWCASE,
    'completed',
  );

  return {
    ...buildRowCurrencyBase(rowIndex),
    id: recordId,
    merchantOrderId: recordId,
    status,
    createdAt: offsetDateTime('2026-06-24 11:59:27', rowIndex),
    receivedAmount: '0',
    orderAmount: formatGroupedDecimalAmount(amountValues.cryptoValue),
    walletFromAddress: fromAddress,
    walletToAddress: toAddress,
  };
}

function buildCollectionHistoryRow(rowIndex: number): PaymentEngineRecordRow {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const fromAddress = resolveDemoWalletAddress(rowIndex, preset, 'from');
  const toAddress = resolveDemoWalletAddress(rowIndex + 1, preset, 'to');
  const amountValues = resolveDemoAmountRowValues(rowIndex);
  const collectionId =
    rowIndex === 0
      ? '1464586558696768'
      : buildDemoHexRecordId(rowIndex, 930);
  const status = resolveShowcaseThenCompletedStatus(
    rowIndex,
    COLLECTION_HISTORY_STATUS_SHOWCASE,
    'success',
  );
  const businessTypeKey = resolveShowcaseThenCompletedStatus(
    rowIndex,
    COLLECTION_HISTORY_BUSINESS_TYPE_SHOWCASE,
    'Collection',
  );

  return {
    ...buildRowCurrencyBase(rowIndex),
    id: collectionId,
    merchantOrderId: collectionId,
    status,
    businessTypeKey,
    createdAt: offsetDateTime('2026-08-27 20:11:41', rowIndex),
    receivedAmount: '0',
    orderAmount: amountValues.cryptoValue,
    orderFiat: amountValues.fiatValue,
    walletFromAddress: fromAddress,
    walletToAddress: toAddress,
    collectionId,
    completionTime: offsetDateTime('2026-08-27 20:11:41', rowIndex),
    ruleName: resolveDemoRuleName(rowIndex),
    ruleNumber:
      rowIndex === 0
        ? 'CO1463926806912640'
        : `CO1463926806912${String(640 + rowIndex).padStart(3, '0')}`,
  };
}

export function resolveWaasStandardRecordRowCount(_menuItem?: string): number {
  return PAYMENT_ENGINE_RECORD_ROW_COUNT;
}

export function buildWaasStandardRecordRows(
  menuItem: string,
  count = resolveWaasStandardRecordRowCount(menuItem),
  subAddressCurrency: WaasSubAddressCurrencySelection = WAAS_SUB_ADDRESS_DEFAULT_SELECTION,
): PaymentEngineRecordRow[] {
  if (menuItem === 'Sub-Address') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildSubAddressRow(rowIndex, subAddressCurrency),
    );
  }

  if (menuItem === 'Wallet Payout') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildPayoutRecordRow('Wallet Payout', rowIndex),
    );
  }

  if (menuItem === 'Sub-Address Payout') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildPayoutRecordRow('Sub-Address Payout', rowIndex),
    );
  }

  if (menuItem === 'History') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildTransactionHistoryRow(rowIndex),
    );
  }

  if (menuItem === 'Processing') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildTransactionProcessingRow(rowIndex),
    );
  }

  if (menuItem === 'Rule Configuration') {
    return Array.from({ length: count }, (_, rowIndex) => buildRuleConfigurationRow(rowIndex));
  }

  if (menuItem === 'Task Record') {
    return Array.from({ length: count }, (_, rowIndex) => buildTaskRecordRow(rowIndex));
  }

  if (menuItem === 'API Collection') {
    return Array.from({ length: count }, (_, rowIndex) => buildApiCollectionRow(rowIndex));
  }

  if (menuItem === 'Collection History') {
    return Array.from({ length: count }, (_, rowIndex) => buildCollectionHistoryRow(rowIndex));
  }

  if (menuItem === 'Collection Processing') {
    return Array.from({ length: count }, (_, rowIndex) =>
      buildCollectionProcessingRow(rowIndex),
    );
  }

  if (menuItem === 'Callback Error' || menuItem === 'History Callback') {
    return buildPaymentEngineRecordRows(menuItem, count);
  }

  return [];
}
