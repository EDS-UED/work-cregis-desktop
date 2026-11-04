import type { FeeRecordOperationTypeKey } from './feeRecordOperationTypes';

/** 详情不展示操作人。 */
const FEE_RECORD_DETAIL_HIDE_OPERATOR: ReadonlySet<FeeRecordOperationTypeKey> = new Set([
  'Recharge',
  'System Recharge',
  'System Refund',
  'Listing Application Rejection Refund',
  'Card Issuance Fee',
  'Account Transfer',
]);

/** 详情展示币种（crypto Apply_Item）。 */
export const FEE_RECORD_DETAIL_SHOW_CURRENCY: ReadonlySet<FeeRecordOperationTypeKey> = new Set([
  'Listing Application Rejection Refund',
]);

/** 详情展示方案 PlanA -> PlanB（eds-module-three）。 */
export const FEE_RECORD_DETAIL_SHOW_PLAN: ReadonlySet<FeeRecordOperationTypeKey> = new Set([
  'Team Plan Upgrade',
  'Team Plan Renewal',
  'Benefits Renewal',
  'Benefits Upgrade',
  'Automation Feature Activation',
  'Benefits Capacity Expansion',
]);

/** 详情展示订单号（团队版本升级 → 划转，不含充值/系统充值/系统退款/补卡费）。 */
export const FEE_RECORD_DETAIL_SHOW_ORDER_NUMBER: ReadonlySet<FeeRecordOperationTypeKey> =
  new Set([
    'Team Plan Upgrade',
    'Team Plan Renewal',
    'Benefits Renewal',
    'Benefits Upgrade',
    'Automation Feature Activation',
    'Benefits Capacity Expansion',
    'Listing Application Fee',
    'Listing Application Rejection Refund',
    'Overage Service Fee',
    'Customized Plan',
    'Tron Activation Fee',
    'Tron Energy Fee',
    'Tron Bandwidth Fee',
    'AML Query',
    'Acquiring Service Fee',
    'Card Issuance Fee',
    'Account Transfer',
  ]);

/** Tron 三类费用 · 详情展示交易哈希（其余订单号类仍隐藏）。 */
export const FEE_RECORD_DETAIL_TRON_FEE_WITH_TX_HASH: ReadonlySet<FeeRecordOperationTypeKey> =
  new Set(['Tron Activation Fee', 'Tron Energy Fee', 'Tron Bandwidth Fee']);

/** AML 查询 · 详情展示数据供应商。 */
export const FEE_RECORD_DETAIL_SHOW_AML_SERVICE_PROVIDER: ReadonlySet<FeeRecordOperationTypeKey> =
  new Set(['AML Query']);

/** AML 查询 · 详情展示方案（手动查询文案 · ui catalog）。 */
export const FEE_RECORD_DETAIL_SHOW_AML_PLAN: ReadonlySet<FeeRecordOperationTypeKey> = new Set([
  'AML Query',
]);

/** 开卡费 / 划转 · 详情展示加密卡。 */
export const FEE_RECORD_DETAIL_SHOW_CRYPTO_CARD: ReadonlySet<FeeRecordOperationTypeKey> = new Set([
  'Card Issuance Fee',
  'Account Transfer',
]);

/** 详情不展示交易哈希。 */
const FEE_RECORD_DETAIL_HIDE_TX_HASH: ReadonlySet<FeeRecordOperationTypeKey> = (() => {
  const hidden = new Set<FeeRecordOperationTypeKey>(['System Recharge', 'System Refund']);
  for (const typeKey of FEE_RECORD_DETAIL_SHOW_ORDER_NUMBER) {
    if (!FEE_RECORD_DETAIL_TRON_FEE_WITH_TX_HASH.has(typeKey)) {
      hidden.add(typeKey);
    }
  }
  return hidden;
})();

export function feeRecordDetailShowsOperator(typeKey: FeeRecordOperationTypeKey): boolean {
  return !FEE_RECORD_DETAIL_HIDE_OPERATOR.has(typeKey);
}

export function feeRecordDetailShowsTxHash(typeKey: FeeRecordOperationTypeKey): boolean {
  return !FEE_RECORD_DETAIL_HIDE_TX_HASH.has(typeKey);
}

export function feeRecordDetailShowsPlan(typeKey: FeeRecordOperationTypeKey): boolean {
  return FEE_RECORD_DETAIL_SHOW_PLAN.has(typeKey);
}

export function feeRecordDetailShowsOrderNumber(typeKey: FeeRecordOperationTypeKey): boolean {
  return FEE_RECORD_DETAIL_SHOW_ORDER_NUMBER.has(typeKey);
}

/** 收单服务费 · 订单号字段标题为批量转账单号，且 Value 区展示「查看转账记录」链。 */
export function feeRecordDetailUsesBulkTransferOrderNumber(
  typeKey: FeeRecordOperationTypeKey,
): boolean {
  return typeKey === 'Acquiring Service Fee';
}

export function feeRecordDetailShowsCurrency(typeKey: FeeRecordOperationTypeKey): boolean {
  return FEE_RECORD_DETAIL_SHOW_CURRENCY.has(typeKey);
}

export function feeRecordDetailShowsAmlServiceProvider(
  typeKey: FeeRecordOperationTypeKey,
): boolean {
  return FEE_RECORD_DETAIL_SHOW_AML_SERVICE_PROVIDER.has(typeKey);
}

export function feeRecordDetailShowsAmlPlan(typeKey: FeeRecordOperationTypeKey): boolean {
  return FEE_RECORD_DETAIL_SHOW_AML_PLAN.has(typeKey);
}

export function feeRecordDetailShowsCryptoCard(typeKey: FeeRecordOperationTypeKey): boolean {
  return FEE_RECORD_DETAIL_SHOW_CRYPTO_CARD.has(typeKey);
}
