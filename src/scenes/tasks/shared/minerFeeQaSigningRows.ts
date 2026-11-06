/** Shell Debug QA · 待签名列表 rowIndex（0-based）；与 `resolveAppMinerFeeQuotes` mock 对齐。 */
export const MINER_FEE_QA_SIGNING_ROW = {
  bitcoinNormal: 19,
  evmNormal: 0,
  /** 第 12 条 · USDT / BSC · 代付 Gas 余额不足（仅此一条） */
  evmGasBalanceInsufficient: 11,
  /** 第 5 条 · USDT / BSC · `evmSponsoredPaymentEnabled=false` */
  evmSponsoredPaymentDisabled: 4,
  theOpenNetworkNormal: 1,
  tronNormal: 18,
  tronRecipientInactive: 17,
  tronTeamBalanceInsufficient: 16,
} as const;

export type MinerFeeQaSigningRowKey = keyof typeof MINER_FEE_QA_SIGNING_ROW;
