import { shallowRef } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type RiskControlAutoRuleFlowApi = {
  startEdit: (row: PaymentEngineRecordRow) => void;
  requestDelete: (row: PaymentEngineRecordRow) => void;
  requestStatusToggle: (row: PaymentEngineRecordRow, nextEnabled: boolean) => void;
};

export const riskControlAutoRuleFlowRegistry = shallowRef<RiskControlAutoRuleFlowApi | null>(
  null,
);

export function registerRiskControlAutoRuleFlow(flow: RiskControlAutoRuleFlowApi | null) {
  riskControlAutoRuleFlowRegistry.value = flow;
}
