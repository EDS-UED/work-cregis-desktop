import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveEgDataListDemoRowIndex,
} from '@/scenes/shared/egDataListMockData';
import type { DetailProgressMemberDeviceInfo } from '@/scenes/tasks/shared/detailProgressMemberDeviceInfo.types';
import { maskDisplayEmail } from '@/utils/maskDisplayEmail';
import type {
  PaymentEngineRecordRow,
  PaymentEngineRuleConfigurationDetailRecord,
} from './paymentEngineRecordConfigs';

/** email-display-seed */
const CREATOR_RAW = [
  { name: 'Alex Mah.', avatarName: 'Alex Mah', email: 'testz@gmail.com' },
  { name: 'Emily Stone', avatarName: 'Emily Stone', email: 'emilyk@gmail.com' },
  { name: 'Ethan Chen', avatarName: 'Ethan Chen', email: 'alexn@cregis.com' },
] as const;

const CREATOR_SAMPLES = CREATOR_RAW.map((creator) => ({
  name: creator.name,
  avatarName: creator.avatarName,
  emailMasked: maskDisplayEmail(creator.email),
}));

/** 列表 / 详情 · 创建人 mock（同 rowIndex 同源）。 */
export function resolveRuleConfigurationCreatorFields(rowIndex: number) {
  const creator = CREATOR_SAMPLES[rowIndex % CREATOR_SAMPLES.length]!;
  const listDisplayValue = `${creator.name} (${creator.emailMasked})`;
  return {
    creatorName: creator.name,
    creatorAvatarName: creator.avatarName,
    creatorEmailMasked: creator.emailMasked,
    logOperatorName: creator.name,
    webhookCreatorEmail: creator.emailMasked,
    webhookCreatorDisplay: listDisplayValue,
  };
}

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
  const creator = resolveRuleConfigurationCreatorFields(rowIndex);

  return {
    ruleNumber: row.ruleNumber ?? row.merchantOrderId ?? row.id,
    collectionSymbol: row.currencySymbol ?? row.orderSymbol,
    collectionCryptoName: row.currencyCryptoName ?? currencyPreset.cryptoName,
    collectionNetworkLabel: row.currencyNetwork ?? currencyPreset.networkLabel ?? '',
    collectionAmountRangeKey: resolveCollectionAmountRangeDisplay(row),
    receivingAddress: row.walletToAddress
      ?? resolveDemoWalletAddress(rowIndex + 3, currencyPreset, 'to'),
    creatorName: creator.creatorName,
    creatorAvatarName: creator.creatorAvatarName,
    creatorEmailMasked: creator.creatorEmailMasked,
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
