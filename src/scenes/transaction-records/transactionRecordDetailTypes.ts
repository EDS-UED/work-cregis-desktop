/** 交易记录详情 — 已定义字段布局的交易类型（catalog 简体中文，与 mock 数据一致）。 */
export const TRANSACTION_RECORD_DETAIL_MANUAL_WALLET_OUT = '钱包人工转出';
export const TRANSACTION_RECORD_DETAIL_API_APPLICATION_OUT = 'API申请转出';
export const TRANSACTION_RECORD_DETAIL_COLLECTION_OUT = '归集转出';
export const TRANSACTION_RECORD_DETAIL_COLLECTION_IN = '归集转入';
export const TRANSACTION_RECORD_DETAIL_MINER_FEE_COLLECTION_OUT = '矿工费（归集）转出';
export const TRANSACTION_RECORD_DETAIL_MINER_FEE_COLLECTION_IN = '矿工费（归集）转入';
export const TRANSACTION_RECORD_DETAIL_NORMAL_IN = '普通转入';
export const TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION = '链上操作';
export const TRANSACTION_RECORD_DETAIL_MINER_FEE_DELEGATION = '矿工费代付';
export const TRANSACTION_RECORD_DETAIL_PARALLEL_OUT = '并行转出';

/** 转出类详情：三方编号 + 发起方 + 签名人 + 备注（14 字段布局）。 */
export const TRANSACTION_RECORD_DETAIL_TRANSFER_OUT_TYPES = new Set<string>([
  TRANSACTION_RECORD_DETAIL_MANUAL_WALLET_OUT,
  TRANSACTION_RECORD_DETAIL_API_APPLICATION_OUT,
]);

export function isTransactionRecordTransferOutDetailType(
  transactionType: string,
): boolean {
  return TRANSACTION_RECORD_DETAIL_TRANSFER_OUT_TYPES.has(transactionType);
}

export function isTransactionRecordCollectionDetailType(
  transactionType: string,
): boolean {
  return (
    transactionType === TRANSACTION_RECORD_DETAIL_COLLECTION_OUT
    || transactionType === TRANSACTION_RECORD_DETAIL_COLLECTION_IN
  );
}

/** 归集转出扩展布局：创建时间 + 矿工费 + 归集编号（11 字段）。 */
export const TRANSACTION_RECORD_DETAIL_EXTENDED_COLLECTION_OUT_TYPES = new Set<string>([
  TRANSACTION_RECORD_DETAIL_COLLECTION_OUT,
  TRANSACTION_RECORD_DETAIL_MINER_FEE_DELEGATION,
]);

export function isTransactionRecordExtendedCollectionOutDetailType(
  transactionType: string,
): boolean {
  return TRANSACTION_RECORD_DETAIL_EXTENDED_COLLECTION_OUT_TYPES.has(transactionType);
}

/** 紧凑归集布局：无创建时间、矿工费（9 字段）。 */
export const TRANSACTION_RECORD_DETAIL_COMPACT_COLLECTION_TYPES = new Set<string>([
  TRANSACTION_RECORD_DETAIL_COLLECTION_IN,
  TRANSACTION_RECORD_DETAIL_MINER_FEE_COLLECTION_OUT,
  TRANSACTION_RECORD_DETAIL_MINER_FEE_COLLECTION_IN,
]);

export function isTransactionRecordCompactCollectionDetailType(
  transactionType: string,
): boolean {
  return TRANSACTION_RECORD_DETAIL_COMPACT_COLLECTION_TYPES.has(transactionType);
}
