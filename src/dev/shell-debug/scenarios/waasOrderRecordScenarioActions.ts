import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import type { PaymentEngineOrderRecordDetailTabKind } from '@/scenes/payment-engine/buildPaymentEngineOrderRecordDetailSections';
import { resolvePaymentEngineOrderRecordDetailTabKinds } from '@/scenes/payment-engine/buildPaymentEngineOrderRecordDetailSections';
import type { PaymentEngineOrderRefundStatus } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { enrichPaymentOrderRecordForDetail } from '@/scenes/payment-engine/paymentEngineOrderRecordDetailData';
import {
  PAYMENT_ORDER_RECORD_ADDITIONAL_PAYMENT_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_BULK_TRANSFER_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_CANCELLED_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_EXPIRED_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_INITIATED_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_PAID_SHOWCASE_ROW_INDEX,
  PAYMENT_ORDER_RECORD_REFUND_SHOWCASE_ROW_INDEX,
  buildPaymentEngineRecordRows,
} from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { applyWaasOrderModeScenario } from './waasScenarioActions';
import { clearQaLoadingTimeout } from './commonScenarioActions';
import { waitForPaymentEngineDetailFlow } from './waitForPaymentEngineDetailFlow';

export function resetWaasOrderRecordScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = paymentEngineDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.detailRow.value = null;
  }
}

function resolveOrderRecordDetailTabIndex(
  rowIndex: number,
  tabKind: PaymentEngineOrderRecordDetailTabKind,
): number {
  const row = buildPaymentEngineRecordRows('Order Record')[rowIndex];
  if (!row) return 0;

  const kinds = resolvePaymentEngineOrderRecordDetailTabKinds(
    enrichPaymentOrderRecordForDetail(row),
  );
  const tabIndex = kinds.indexOf(tabKind);
  return tabIndex >= 0 ? tabIndex : 0;
}

export async function applyOrderRecordDetailScenario(
  rowIndex: number,
  tabKind: PaymentEngineOrderRecordDetailTabKind = 'order',
) {
  resetWaasOrderRecordScenarioBaseline();
  applyWaasOrderModeScenario();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildPaymentEngineRecordRows('Order Record')[rowIndex];
  if (!row) return;

  flow.openDetailForRow(row, 'Order Record', resolveOrderRecordDetailTabIndex(rowIndex, tabKind));
}

/** 第 1 行 · 新订单 · 仅订单详情（无支付 Tab）。 */
export function applyOrderRecordInitiatedDetailScenario() {
  applyOrderRecordDetailScenario(PAYMENT_ORDER_RECORD_INITIATED_SHOWCASE_ROW_INDEX, 'order');
}

/** 第 2 行 · 需补款 · 支付信息（首次支付 + 补款支付 + 分割线）。 */
export function applyOrderRecordAdditionalPaymentDetailScenario() {
  applyOrderRecordDetailScenario(
    PAYMENT_ORDER_RECORD_ADDITIONAL_PAYMENT_SHOWCASE_ROW_INDEX,
    'payment',
  );
}

/** 第 3 行 · 已支付 · 支付信息。 */
export function applyOrderRecordPaidPaymentDetailScenario() {
  applyOrderRecordDetailScenario(PAYMENT_ORDER_RECORD_PAID_SHOWCASE_ROW_INDEX, 'payment');
}

async function applyOrderRecordRefundDetailScenarioWithStatus(
  refundStatus: PaymentEngineOrderRefundStatus,
) {
  resetWaasOrderRecordScenarioBaseline();
  applyWaasOrderModeScenario();

  const flow = await waitForPaymentEngineDetailFlow();
  if (!flow) return;

  const row = buildPaymentEngineRecordRows('Order Record')[PAYMENT_ORDER_RECORD_REFUND_SHOWCASE_ROW_INDEX];
  if (!row) return;

  const enriched = enrichPaymentOrderRecordForDetail(row, { refundStatus });
  const tabIndex = resolvePaymentEngineOrderRecordDetailTabKinds(enriched).indexOf('settlement');

  flow.openDetailForRow(
    enriched,
    'Order Record',
    tabIndex >= 0 ? tabIndex : 0,
  );
}

/** 第 4 行 · 已转账 + 退款中 · 退款信息 Tab。 */
export function applyOrderRecordRefundPendingDetailScenario() {
  applyOrderRecordRefundDetailScenarioWithStatus('pending');
}

/** 第 4 行 · 已转账 + 退款失败 · 退款信息 Tab。 */
export function applyOrderRecordRefundFailedDetailScenario() {
  applyOrderRecordRefundDetailScenarioWithStatus('failed');
}

/** 第 4 行 · 已转账 + 退款完成 · 退款信息 Tab（含退款区块事件、交易哈希）。 */
export function applyOrderRecordRefundCompletedDetailScenario() {
  applyOrderRecordRefundDetailScenarioWithStatus('success');
}

/** 第 5 行 · 已取消 · 仅订单详情。 */
export function applyOrderRecordCancelledDetailScenario() {
  applyOrderRecordDetailScenario(PAYMENT_ORDER_RECORD_CANCELLED_SHOWCASE_ROW_INDEX, 'order');
}

/** 第 6 行 · 已过期 · 仅订单详情。 */
export function applyOrderRecordExpiredDetailScenario() {
  applyOrderRecordDetailScenario(PAYMENT_ORDER_RECORD_EXPIRED_SHOWCASE_ROW_INDEX, 'order');
}

/** 第 7 行 · 已转账 + 批量转账 · 批量转账详情 Tab。 */
export function applyOrderRecordBulkTransferDetailScenario() {
  applyOrderRecordDetailScenario(
    PAYMENT_ORDER_RECORD_BULK_TRANSFER_SHOWCASE_ROW_INDEX,
    'settlement',
  );
}
