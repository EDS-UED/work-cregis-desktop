import { nextTick } from 'vue';
import {
  paymentEngineDetailFlowRegistry,
  type PaymentEngineDetailFlowInstance,
} from '@/scenes/payment-engine/paymentEngineDetailFlowContext';

/** QA 切页后等待 PaymentEngineDataListPage 注册 detail flow（首帧 registry 常为 null）。 */
export async function waitForPaymentEngineDetailFlow(): Promise<PaymentEngineDetailFlowInstance | null> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const flow = paymentEngineDetailFlowRegistry.value;
    if (flow) {
      return flow;
    }
    await nextTick();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  return paymentEngineDetailFlowRegistry.value;
}
