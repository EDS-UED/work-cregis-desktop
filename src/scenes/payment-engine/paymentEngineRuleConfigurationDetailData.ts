import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import type { DetailProgressMemberDeviceInfo } from '@/scenes/tasks/shared/detailProgressMemberDeviceInfo.types';
import type {
  PaymentEngineRecordRow,
  PaymentEngineRuleConfigurationDetailRecord,
} from './paymentEngineRecordConfigs';

const CREATOR_SAMPLES = [
  { name: 'Alex Mah.', avatarName: 'Alex Mah', emailMasked: 't******z@gmail.com' },
  { name: 'Emily Stone', avatarName: 'Emily Stone', emailMasked: 'e******k@gmail.com' },
  { name: 'Ethan Chen', avatarName: 'Ethan Chen', emailMasked: 'a******n@cregis.com' },
] as const;

const DEFAULT_DEVICE_INFO: DetailProgressMemberDeviceInfo = {
  deviceType: 'MacOS(v3.6.0)',
  deviceId: 'AXSMJSAXJQ',
  ip: '192.168.2.1',
};

function resolveCollectionAmountRangeDisplay(
  row: PaymentEngineRecordRow,
): string {
  const value = row.collectionAmountRangeKey?.trim();
  if (!value || value === 'Unlimited') {
    return 'Unlimited';
  }
  return value;
}

function buildRuleConfigurationDetailRecord(
  row: PaymentEngineRecordRow,
  rowIndex: number,
): PaymentEngineRuleConfigurationDetailRecord {
  const currencyPreset = resolveCurrencyRowPreset(rowIndex);
  const creator = CREATOR_SAMPLES[rowIndex % CREATOR_SAMPLES.length]!;

  return {
    ruleNumber: row.ruleNumber ?? row.merchantOrderId ?? row.id,
    collectionSymbol: row.currencySymbol ?? row.orderSymbol,
    collectionCryptoName: row.currencyCryptoName ?? currencyPreset.cryptoName,
    collectionNetworkLabel: row.currencyNetwork ?? currencyPreset.networkLabel ?? '',
    collectionAmountRangeKey: resolveCollectionAmountRangeDisplay(row),
    receivingAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(rowIndex + 3, currencyPreset, 'to'),
    creatorName: creator.name,
    creatorAvatarName: creator.avatarName,
    creatorEmailMasked: creator.emailMasked,
    creatorDeviceInfo: DEFAULT_DEVICE_INFO,
    createdAt: row.createdAt,
  };
}

export function enrichPaymentRuleConfigurationRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  const rowIndex = resolveEgDataListDemoRowIndex(row);

  return {
    ...row,
    ruleConfigurationDetail: buildRuleConfigurationDetailRecord(row, rowIndex),
  };
}

export function resolvePaymentRuleConfigurationRecordDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRuleConfigurationDetailRecord {
  return buildRuleConfigurationDetailRecord(row, resolveEgDataListDemoRowIndex(row));
}
