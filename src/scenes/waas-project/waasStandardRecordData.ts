import {
  buildDemoHexRecordId,
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import {
  buildPaymentEngineRecordRows,
  PAYMENT_ENGINE_RECORD_ROW_COUNT,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { WAAS_STANDARD_RECORD_PAGE_CONFIG } from './waasStandardRecordConfigs';
import type { WaasStandardDataListMenuItem } from './waasStandardMenuData';

const TASK_RECORD_AMOUNTS = ['1.66', '0.97', '5.15'] as const;
const TASK_RECORD_COUNTS = ['30', '30', '30'] as const;
const TASK_RECORD_START_TIMES = [
  '2026-08-27 21:24:47',
  '2026-08-27 21:24:47',
  '2026-08-27 21:24:47',
] as const;
const TASK_RECORD_END_TIMES = [
  '2026-08-27 21:29:00',
  '2026-08-27 21:29:00',
  '2026-08-27 21:29:00',
] as const;
const TASK_RECORD_COLLECTION_IDS = [
  '1464590243540288',
  '1464590243540288',
  '1464590243540288',
] as const;

const COLLECTION_HISTORY_AMOUNTS = [
  '0.9308442060191393',
  '0.9308442060191393',
  '0.9308442060191393',
] as const;
const COLLECTION_HISTORY_COMPLETION_TIMES = [
  '2026-08-27 20:11:41',
  '2026-08-27 20:11:41',
  '2026-08-27 20:11:41',
] as const;
const COLLECTION_HISTORY_IDS = [
  '1464586558696768',
  '1464586558696768',
  '1464586558696768',
] as const;

function buildUsdtBscRowBase(rowIndex: number): Pick<
  PaymentEngineRecordRow,
  | 'currencySymbol'
  | 'currencyNetwork'
  | 'currencyShowNetwork'
  | 'currencyCryptoName'
  | 'orderSymbol'
  | 'networkLabel'
> {
  const preset = resolveCurrencyRowPreset(rowIndex);
  return {
    currencySymbol: 'USDT',
    currencyNetwork: 'BNB-BSC#Testnet',
    currencyShowNetwork: true,
    currencyCryptoName: preset.cryptoName,
    orderSymbol: 'USDT',
    networkLabel: 'BNB-BSC#Testnet',
  };
}

function buildRuleConfigurationRow(): PaymentEngineRecordRow {
  return {
    ...buildUsdtBscRowBase(0),
    id: 'CO1463926806912640',
    merchantOrderId: 'CO1463926806912640',
    status: 'success',
    createdAt: '2026-08-18 12:27:08',
    receivedAmount: '0',
    receivedSymbol: 'USDT',
    orderAmount: '0',
    ruleName: '7702',
    ruleNumber: 'CO1463926806912640',
    collectionAmountRangeKey: 'Unlimited',
    ruleEnabled: true,
  };
}

function buildTaskRecordRow(rowIndex: number): PaymentEngineRecordRow {
  return {
    ...buildUsdtBscRowBase(rowIndex),
    id: TASK_RECORD_COLLECTION_IDS[rowIndex] ?? TASK_RECORD_COLLECTION_IDS[0],
    merchantOrderId: TASK_RECORD_COLLECTION_IDS[rowIndex] ?? TASK_RECORD_COLLECTION_IDS[0],
    status: 'completed',
    createdAt: TASK_RECORD_START_TIMES[rowIndex] ?? TASK_RECORD_START_TIMES[0],
    receivedAmount: '0',
    receivedSymbol: 'USDT',
    orderAmount: TASK_RECORD_AMOUNTS[rowIndex] ?? TASK_RECORD_AMOUNTS[0],
    collectionId: TASK_RECORD_COLLECTION_IDS[rowIndex] ?? TASK_RECORD_COLLECTION_IDS[0],
    taskStartAt: TASK_RECORD_START_TIMES[rowIndex] ?? TASK_RECORD_START_TIMES[0],
    taskEndAt: TASK_RECORD_END_TIMES[rowIndex] ?? TASK_RECORD_END_TIMES[0],
    taskTransactionCount: TASK_RECORD_COUNTS[rowIndex] ?? TASK_RECORD_COUNTS[0],
  };
}

function buildApiCollectionRow(rowIndex: number): PaymentEngineRecordRow {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const fromAddress = resolveDemoWalletAddress(rowIndex, currencyPreset, 'from');
  const toAddress = resolveDemoWalletAddress(rowIndex, currencyPreset, 'to');
  const amount = formatGroupedDecimalAmount((0.742015 + rowIndex * 0.0135).toFixed(6));
  const recordId = buildDemoHexRecordId(rowIndex + 200);
  return {
    ...buildUsdtBscRowBase(rowIndex),
    id: recordId,
    merchantOrderId: recordId,
    status: 'pending',
    createdAt: `2026-06-24 11:59:${String(27 + rowIndex).padStart(2, '0')}`,
    receivedAmount: '0',
    receivedSymbol: 'USDT',
    orderAmount: amount,
    walletFromAddress: fromAddress,
    walletToAddress: toAddress,
  };
}

function buildCollectionHistoryRow(rowIndex: number): PaymentEngineRecordRow {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const fromAddress = resolveDemoWalletAddress(rowIndex, currencyPreset, 'from');
  const toAddress = resolveDemoWalletAddress(rowIndex + 2, currencyPreset, 'to');
  return {
    ...buildUsdtBscRowBase(rowIndex),
    id: COLLECTION_HISTORY_IDS[rowIndex] ?? COLLECTION_HISTORY_IDS[0],
    merchantOrderId: COLLECTION_HISTORY_IDS[rowIndex] ?? COLLECTION_HISTORY_IDS[0],
    status: 'success',
    createdAt: COLLECTION_HISTORY_COMPLETION_TIMES[rowIndex] ?? COLLECTION_HISTORY_COMPLETION_TIMES[0],
    receivedAmount: '0',
    receivedSymbol: 'USDT',
    orderAmount: COLLECTION_HISTORY_AMOUNTS[rowIndex] ?? COLLECTION_HISTORY_AMOUNTS[0],
    walletFromAddress: fromAddress,
    walletToAddress: toAddress,
    collectionId: COLLECTION_HISTORY_IDS[rowIndex] ?? COLLECTION_HISTORY_IDS[0],
    completionTime: COLLECTION_HISTORY_COMPLETION_TIMES[rowIndex] ?? COLLECTION_HISTORY_COMPLETION_TIMES[0],
  };
}

export function resolveWaasStandardRecordRowCount(menuItem: string): number {
  const config = WAAS_STANDARD_RECORD_PAGE_CONFIG[menuItem as WaasStandardDataListMenuItem];
  return config?.rowCount ?? PAYMENT_ENGINE_RECORD_ROW_COUNT;
}

export function buildWaasStandardRecordRows(
  menuItem: string,
  count = resolveWaasStandardRecordRowCount(menuItem),
): PaymentEngineRecordRow[] {
  if (menuItem === 'Rule Configuration') {
    return [buildRuleConfigurationRow()];
  }

  if (menuItem === 'Task Record') {
    return Array.from({ length: count }, (_, rowIndex) => buildTaskRecordRow(rowIndex));
  }

  if (menuItem === 'API Collection') {
    return Array.from({ length: count }, (_, rowIndex) => buildApiCollectionRow(rowIndex));
  }

  if (menuItem === 'History') {
    return Array.from({ length: count }, (_, rowIndex) => buildCollectionHistoryRow(rowIndex));
  }

  if (menuItem === 'Callback Error' || menuItem === 'History Callback') {
    return buildPaymentEngineRecordRows(menuItem, count);
  }

  return [];
}
