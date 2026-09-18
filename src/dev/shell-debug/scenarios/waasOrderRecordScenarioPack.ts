import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import {
  applyOrderRecordAdditionalPaymentDetailScenario,
  applyOrderRecordBulkTransferDetailScenario,
  applyOrderRecordCancelledDetailScenario,
  applyOrderRecordExpiredDetailScenario,
  applyOrderRecordInitiatedDetailScenario,
  applyOrderRecordPaidPaymentDetailScenario,
  applyOrderRecordRefundCompletedDetailScenario,
  applyOrderRecordRefundFailedDetailScenario,
  applyOrderRecordRefundPendingDetailScenario,
} from './waasOrderRecordScenarioActions';

export const WAAS_ORDER_RECORD_DETAIL_SCENARIOS = [
  {
    id: 'order-record-detail-initiated',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 新订单',
    description: '第 1 行新订单 · 仅订单详情 Tab（无支付信息 Tab）。',
    apply: applyOrderRecordInitiatedDetailScenario,
  },
  {
    id: 'order-record-detail-additional-payment',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 多次支付（需补款）',
    description:
      '第 2 行需补款 · 支付信息 Tab：首次支付 + 补款支付两段分区标题 + 段间分割线。',
    apply: applyOrderRecordAdditionalPaymentDetailScenario,
  },
  {
    id: 'order-record-detail-paid-payment',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 单次支付（已支付）',
    description: '第 3 行已支付 · 支付信息 Tab：仅一条支付记录，无「首次支付」分区标题。',
    apply: applyOrderRecordPaidPaymentDetailScenario,
  },
  {
    id: 'order-record-detail-refund-pending',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 退款中',
    description: '第 4 行已转账 · 退款信息 Tab：退款中、部分退款、用户编号 / 地址 / 金额字段。',
    apply: applyOrderRecordRefundPendingDetailScenario,
  },
  {
    id: 'order-record-detail-refund-failed',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 退款失败',
    description: '第 4 行已转账 · 退款信息 Tab：退款失败态（无退款区块事件 / 交易哈希）。',
    apply: applyOrderRecordRefundFailedDetailScenario,
  },
  {
    id: 'order-record-detail-refund-completed',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 退款完成',
    description:
      '第 4 行已转账 · 退款信息 Tab：退款完成 + 退款区块事件 + 交易哈希。',
    apply: applyOrderRecordRefundCompletedDetailScenario,
  },
  {
    id: 'order-record-detail-cancelled',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 已取消',
    description: '第 5 行已取消 · 仅订单详情 Tab（无支付信息 Tab）。',
    apply: applyOrderRecordCancelledDetailScenario,
  },
  {
    id: 'order-record-detail-expired',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 已过期',
    description: '第 6 行已过期 · 仅订单详情 Tab（无支付信息 Tab）。',
    apply: applyOrderRecordExpiredDetailScenario,
  },
  {
    id: 'order-record-detail-bulk-transfer',
    pageKey: 'WaaS:Order Record' as const,
    label: '详情 · 已转账 · 批量转账',
    description:
      '第 7 行已转账 · 打开批量转账详情 Tab：批量转账 ID / 地址 / 服务费 / 扣费来源。',
    apply: applyOrderRecordBulkTransferDetailScenario,
  },
];

export function registerWaasOrderRecordScenarioPack() {
  replaceShellDebugScenariosForPage('WaaS:Order Record', [
    createWaasOrderModeBusinessScenario('WaaS:Order Record'),
    ...WAAS_ORDER_RECORD_DETAIL_SCENARIOS,
  ]);
}

registerWaasOrderRecordScenarioPack();
