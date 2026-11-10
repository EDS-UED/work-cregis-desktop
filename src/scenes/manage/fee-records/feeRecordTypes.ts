import type { FeeRecordOperationTypeKey } from './feeRecordOperationTypes';

export type { FeeRecordOperationTypeKey };
export { FEE_RECORD_OPERATION_TYPE_KEYS } from './feeRecordOperationTypes';

/** 费用记录 · 账户 catalog key（ui()）。 */
export type FeeRecordAccountKey = 'Team Account' | 'Gas Account';

/** 费用记录 · 列表状态列。 */
export type FeeRecordStatusKey = 'Processing' | 'Failed' | 'Completed';

export type FeeRecordRow = {
  id: string;
  operationTypeKey: FeeRecordOperationTypeKey;
  /** 列表状态列（优先于 operationStatusTagKey）。 */
  recordStatusKey?: FeeRecordStatusKey;
  /** @deprecated 划转会话遗留；新写入请用 recordStatusKey。 */
  operationStatusTagKey?: 'Processing' | 'Failed';
  /** 操作人展示名（筛选 member · 字段 value 禁止 ui()）。 */
  operatorName: string;
  transactionTime: string;
  txHash: string;
  amount: string;
  accountKey: FeeRecordAccountKey;
  /** 金额副行账户文案 catalog（默认 accountKey）。 */
  accountDisplayKey?: string;
  /** 列表金额列按主链币种展示（无则主行 USD）。 */
  listAmountCryptoSymbol?: string;
  listAmountCryptoName?: string;
  /** 方案变更展示（字段 value · 禁止 ui()）。 */
  planTransition?: string;
  /** 订单号（字段 value · 禁止 ui()）。 */
  orderNumber?: string;
  /** 详情币种 · symbol（字段 value）。 */
  currencySymbol?: string;
  currencyCryptoName?: string;
  currencyNetworkLabel?: string;
  currencyShowNetwork?: boolean;
  /** AML · 数据供应商（字段 value · 禁止 ui()）。 */
  amlServiceProvider?: string;
  /** 开卡费 / 划转 · 加密卡展示（字段 value · 禁止 ui()）。 */
  cryptoCardLabel?: string;
};
