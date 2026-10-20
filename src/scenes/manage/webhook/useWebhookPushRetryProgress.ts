import { onBeforeUnmount, ref, watch, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { completePushRecordAutoRetry } from './webhookStore';

export const WEBHOOK_PUSH_RETRY_TOTAL = 3;
export const WEBHOOK_PUSH_RETRY_INTERVAL_MS = 1000;

export function useWebhookPushRetryProgress(row: Ref<PaymentEngineRecordRow>) {
  const retryStep = ref(1);
  let timer: ReturnType<typeof setInterval> | undefined;

  function clearTimer() {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  }

  function syncRetryingState() {
    clearTimer();
    if (row.value.webhookPushStatusKey !== 'retrying') {
      retryStep.value = 1;
      return;
    }

    retryStep.value = 1;
    timer = setInterval(() => {
      if (row.value.webhookPushStatusKey !== 'retrying') {
        clearTimer();
        return;
      }
      if (retryStep.value < WEBHOOK_PUSH_RETRY_TOTAL) {
        retryStep.value += 1;
        return;
      }
      clearTimer();
      completePushRecordAutoRetry(row.value.id);
    }, WEBHOOK_PUSH_RETRY_INTERVAL_MS);
  }

  watch(() => row.value.webhookPushStatusKey, syncRetryingState, { immediate: true });
  watch(() => row.value.id, syncRetryingState);

  onBeforeUnmount(clearTimer);

  return { retryStep };
}
