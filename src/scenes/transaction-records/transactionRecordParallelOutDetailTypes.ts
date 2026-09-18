export type TransactionRecordParallelOutDetailLine = {
  id: string;
  lineIndex: number;
  amount: string;
  fiatAmount: string;
  symbol: string;
  cryptoName: string;
  showNetwork: boolean;
  networkLabel: string;
  transactionType: string;
  fromAlias: string;
  fromAddress: string;
  toAddress: string;
};
