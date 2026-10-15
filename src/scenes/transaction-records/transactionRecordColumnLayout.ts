/** 交易记录 DataList 列 min-width（§7.7 仅经 EgDataListColumn 传入）。 */
/** 单行 YYYY-MM-DD HH:MM:SS（body-medium tabular）；固定宽不参与 flex 余量均分。 */
/** Label + sort + timezone triggers; fixed width (no flex grow). */
export const TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH = '200px';
export const TRANSACTION_RECORD_TIME_COLUMN_WIDTH = TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH;
/** Address 视图：收紧时间列，让交互地址更靠近时间列。 */
export const TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_MIN_WIDTH = '176px';
export const TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_WIDTH =
  TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_MIN_WIDTH;
/**
 * Wallet 视图列更多（含所属钱包 + 收支类型）；略收紧 min-width，
 * 使 Σmin ≤ DataList 预算，避免响应式裁掉「收支类型」。
 */
/** Wallet 视图：币种|地址 合并列。 */
export const TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH = '148px';
/**
 * Address 视图：交互地址列（与币种拆开）。
 * 固定宽、不 flex-grow，紧挨交易时间，余量留给哈希/金额等列。
 */
export const TRANSACTION_RECORD_ADDRESS_COLUMN_MIN_WIDTH = '112px';
export const TRANSACTION_RECORD_ADDRESS_COLUMN_WIDTH = TRANSACTION_RECORD_ADDRESS_COLUMN_MIN_WIDTH;
/** Address 视图：币种列（与交互地址拆开）。 */
export const TRANSACTION_RECORD_TOKEN_COLUMN_MIN_WIDTH = '96px';
export const TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH = '88px';
export const TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH = '88px';
export const TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH = '96px';
export const TRANSACTION_RECORD_BUSINESS_TYPE_COLUMN_MIN_WIDTH = '112px';
export const TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH = '80px';
export const TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH = '100px';
