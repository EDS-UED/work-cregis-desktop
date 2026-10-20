export type TransactionRecordDirection = 'out' | 'in';

export type TransactionRecordRow = {
  id: string;
  createdTime: string;
  transactionTime: string;
  symbol: string;
  cryptoName: string;
  showNetwork: boolean;
  networkLabel: string;
  fromAlias: string;
  fromAddress: string;
  toAlias?: string;
  toAddress: string;
  txHash: string;
  walletName: string;
  transactionType: string;
  directionLabel: string;
  transactionCount: string;
  /** BTC 并行转出详情：笔数行尾展示「查看明细」链接。 */
  transactionCountShowsDetailLink?: boolean;
  minerFeeDisplay: string;
  /** 钱包人工转出 */
  thirdPartyRef?: string;
  initiatorDisplay?: string;
  signerDisplay?: string;
  remark?: string;
  /** 归集转出 */
  collectionNumber?: string;
  amount: string;
  fiatAmount: string;
};
