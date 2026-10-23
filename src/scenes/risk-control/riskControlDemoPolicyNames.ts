/** AML 自动规则 / 查询记录 mock 共用策略名（与风控列表 ruleName 列一致）。 */
const POLICY_NAME_SHOWCASE = [
  'Real World Assets Protocols',
  'Telegram Bot',
  '元宇宙',
  '物联网',
  'Wd_Test_003',
  'Binance Wallet IDO',
  'Oracles',
  'Cat-Themed',
] as const;

const POLICY_NAME_POOL = [
  'Treasury Sweep',
  'Client Deposit',
  'Night Batch',
  'Weekend Guard',
  'EMEA Sweep',
  'Asia Pacific',
  'Retail Flow',
  'Institutional',
] as const;

const POLICY_NAME_TAIL = [
  'Liquidity Router',
  'Cross-Border',
  'Stablecoin Guard',
  'Hot Wallet Bridge',
  'Cold Storage Exit',
  'Payroll Run',
  'Vendor Payout',
  'Merchant Settlement',
  'Gas Top-Up',
  'Compliance Hold',
  'Multi-Sig Release',
  'Sandbox Test',
] as const;

export function resolveRiskControlDemoPolicyName(rowIndex: number): string {
  if (rowIndex < POLICY_NAME_SHOWCASE.length) {
    return POLICY_NAME_SHOWCASE[rowIndex]!;
  }

  const poolIndex = rowIndex - POLICY_NAME_SHOWCASE.length;
  if (poolIndex < POLICY_NAME_POOL.length) {
    return POLICY_NAME_POOL[poolIndex]!;
  }

  const tailIndex = poolIndex - POLICY_NAME_POOL.length;
  return POLICY_NAME_TAIL[tailIndex] ?? POLICY_NAME_TAIL[POLICY_NAME_TAIL.length - 1]!;
}
