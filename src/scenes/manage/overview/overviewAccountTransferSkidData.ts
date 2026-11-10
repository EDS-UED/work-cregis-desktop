import type { CryptoName } from '@eds/desktop-components';
import type { OverviewGasRechargeAccountKey } from './overviewRechargeSkidData';

export const OVERVIEW_ACCOUNT_TRANSFER_MIN_USD = 100;
export const OVERVIEW_ACCOUNT_TRANSFER_MAX_USD = 150_000;

/** Mock：团队账户可用余额（USD）。 */
export const OVERVIEW_ACCOUNT_TRANSFER_TEAM_AVAILABLE_USD = 128_430.52;

/** Mock：划转金额美分尾数为该值时模拟链上失败（如 $100.77）。 */
export const OVERVIEW_ACCOUNT_TRANSFER_MOCK_FAIL_CENTS = 77;

export function shouldMockOverviewAccountTransferFail(amountUsd: number): boolean {
  return Math.round(amountUsd * 100) % 100 === OVERVIEW_ACCOUNT_TRANSFER_MOCK_FAIL_CENTS;
}

export type OverviewAccountTransferTargetKey = Extract<
  OverviewGasRechargeAccountKey,
  'eth' | 'bnb' | 'pol' | 'trx'
>;

export type OverviewAccountTransferTargetOption = {
  key: OverviewAccountTransferTargetKey;
  titleKey: string;
  cryptoName: CryptoName;
};

const TRANSFER_TARGETS_FULL: readonly OverviewAccountTransferTargetOption[] = [
  {
    key: 'eth',
    titleKey: 'ETH Gas Account',
    cryptoName: 'eds-eth-ethereum',
  },
  {
    key: 'bnb',
    titleKey: 'BNB Gas Account',
    cryptoName: 'eds-bnb-binance coin',
  },
  {
    key: 'pol',
    titleKey: 'POL Gas Account',
    cryptoName: 'eds-pol-polygon',
  },
];

const TRANSFER_TARGET_GAS_OFF: readonly OverviewAccountTransferTargetOption[] = [
  {
    key: 'trx',
    titleKey: 'TRX Gas Account',
    cryptoName: 'eds-trx-tron',
  },
];

export function listOverviewAccountTransferTargets(
  gasProxyEnabled: boolean,
): readonly OverviewAccountTransferTargetOption[] {
  return gasProxyEnabled ? TRANSFER_TARGETS_FULL : TRANSFER_TARGET_GAS_OFF;
}

export const OVERVIEW_ACCOUNT_TRANSFER_DEFAULT_TARGET: OverviewAccountTransferTargetKey = 'eth';

export function resolveOverviewAccountTransferDefaultTarget(
  gasProxyEnabled: boolean,
): OverviewAccountTransferTargetKey {
  const options = listOverviewAccountTransferTargets(gasProxyEnabled);
  return options[0]?.key ?? 'trx';
}

/** Mock：1 单位原生币的 USD 估价（演示换算，非行情真源）。 */
const TRANSFER_MOCK_USD_PER_NATIVE: Record<OverviewAccountTransferTargetKey, number> = {
  eth: 2_500,
  bnb: 600,
  pol: 0.4,
  trx: 0.25,
};

export function convertOverviewTransferUsdToNative(
  amountUsd: number,
  targetKey: OverviewAccountTransferTargetKey,
): number {
  const usdPerNative = TRANSFER_MOCK_USD_PER_NATIVE[targetKey];
  return amountUsd / usdPerNative;
}
