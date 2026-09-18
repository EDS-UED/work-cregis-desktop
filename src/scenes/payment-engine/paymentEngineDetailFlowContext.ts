import { shallowRef } from 'vue';
import type { usePaymentEngineDetailFlow } from './usePaymentEngineDetailFlow';

export type PaymentEngineDetailFlowInstance = ReturnType<
  typeof usePaymentEngineDetailFlow
>;

export const paymentEngineDetailFlowRegistry =
  shallowRef<PaymentEngineDetailFlowInstance | null>(null);

export function registerPaymentEngineDetailFlow(
  flow: PaymentEngineDetailFlowInstance | null,
) {
  paymentEngineDetailFlowRegistry.value = flow;
}
