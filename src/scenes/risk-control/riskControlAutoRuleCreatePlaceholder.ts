import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

/** AML · 自动规则列表 toolbar「新增」→ 详情占位行（mock）。 */
export function buildRiskControlAutoRuleCreatePlaceholderRow(): PaymentEngineRecordRow {
  return {
    id: 'NEW',
    merchantOrderId: 'NEW',
    status: 'success',
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: 'New Auto Rule',
    ruleNumber: 'NEW-00001',
    ruleEnabled: true,
    autoRuleDirection: 'inflow',
    autoRuleScopeKey: 'Manual Transfer',
    autoRuleWaasProject: 'Doris Stodio',
    autoRuleServiceProvider: 'Elliptic',
  };
}
