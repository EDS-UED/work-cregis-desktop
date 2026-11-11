import type { CryptoName } from '@eds/desktop-components';
import type { FeeRecordRow } from './feeRecordTypes';

/** 费用记录 · Gas 子账户列表金额列演示（主行币种 + 副行账户 catalog）。 */
export const FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS = [
  {
    accountDisplayKey: 'ETH Gas Account',
    listAmountCryptoSymbol: 'ETH',
    listAmountCryptoName: 'eds-eth-ethereum' as CryptoName,
    demoNativeAmount: '8.88',
  },
  {
    accountDisplayKey: 'BNB Gas Account',
    listAmountCryptoSymbol: 'BNB',
    listAmountCryptoName: 'eds-bnb-binance coin' as CryptoName,
    demoNativeAmount: '24.06',
  },
  {
    accountDisplayKey: 'POL Gas Account',
    listAmountCryptoSymbol: 'POL',
    listAmountCryptoName: 'eds-pol-polygon' as CryptoName,
    demoNativeAmount: '32114197.25',
  },
] as const;

export type FeeRecordGasAccountListSlot = (typeof FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS)[number];

export function pickFeeRecordGasAccountListSlot(seed: number): FeeRecordGasAccountListSlot {
  const index = ((seed % FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS.length) + FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS.length)
    % FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS.length;
  return FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS[index]!;
}

export function resolveFeeRecordGasListMetaFromDisplayKey(
  accountDisplayKey: string | undefined,
): FeeRecordGasAccountListSlot | null {
  const key = accountDisplayKey?.trim();
  if (!key) return null;
  return FEE_RECORD_GAS_ACCOUNT_LIST_SLOTS.find((slot) => slot.accountDisplayKey === key) ?? null;
}

function seedFromFeeRecordId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** 账户划入 · 列表/详情统一为 Gas 子账户 + 币种金额。 */
export function normalizeFeeRecordAccountTransferInRow(row: FeeRecordRow): FeeRecordRow {
  if (row.operationTypeKey !== 'Account Transfer In') return row;
  const hasGasSecondary =
    Boolean(row.accountDisplayKey?.includes('Gas Account'))
    || row.accountKey === 'Gas Account';
  const hasCryptoList = Boolean(row.listAmountCryptoSymbol?.trim());
  if (hasGasSecondary && hasCryptoList) return row;

  const slot = pickFeeRecordGasAccountListSlot(seedFromFeeRecordId(row.id));
  const staleFiatList = !hasCryptoList && (row.accountKey === 'Team Account' || !hasGasSecondary);
  return {
    ...row,
    accountKey: 'Gas Account' as const,
    accountDisplayKey: row.accountDisplayKey?.includes('Gas Account')
      ? row.accountDisplayKey
      : slot.accountDisplayKey,
    listAmountCryptoSymbol: row.listAmountCryptoSymbol ?? slot.listAmountCryptoSymbol,
    listAmountCryptoName: row.listAmountCryptoName ?? slot.listAmountCryptoName,
    amount: staleFiatList ? slot.demoNativeAmount : row.amount,
  };
}
