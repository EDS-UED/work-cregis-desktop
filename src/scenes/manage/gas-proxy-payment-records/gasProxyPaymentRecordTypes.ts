/** Gas 代付记录 · 交易类型 catalog key（ui()）。 */
export type GasProxyPaymentTransactionTypeKey =
  | 'Manual Transfer'
  | 'Collection'
  | 'API Wallet Payout'
  | 'Contract Authorization'
  | 'Revoke Authorization'
  | 'EIP-7702 Upgrade'
  | 'Remittance'
  | 'API Sub-Address Payout';

/** Gas 代付记录 · 扣费账户 catalog key（ui()）。 */
export type GasProxyPaymentAccountKey =
  | 'Team Account'
  | 'ETH Gas Account'
  | 'BNB Gas Account'
  | 'POL Gas Account'
  | 'SOL Gas Account';

export type GasProxyTronProxyResources = {
  bandwidthTrx?: string;
  energyTrx?: string;
  addressActivationTrx?: string;
};

export type GasProxyPaymentRecordRow = {
  id: string;
  symbol: string;
  cryptoName: string;
  showNetwork: boolean;
  networkLabel: string;
  transactionTypeKey: GasProxyPaymentTransactionTypeKey;
  txHash: string;
  transactionTime: string;
  deductedAmount: string;
  /** 筛选合计 · USD 数值真源。 */
  deductedAmountUsd: number;
  /** Tron 详情 · 扣费金额展示（$xxx）。 */
  deductedAmountFiatDisplay: string;
  /** 列表扣费 · Gas 账户行主行原生币数量（字段 value）。 */
  deductedAmountGasNative: string;
  accountKey: GasProxyPaymentAccountKey;
  isTronNetwork: boolean;
  tronProxyResources?: GasProxyTronProxyResources;
};
