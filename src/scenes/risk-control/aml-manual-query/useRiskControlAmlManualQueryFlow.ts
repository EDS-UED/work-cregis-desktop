import { ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';

const MOCK_TRADE_PASSWORD = '111111';

export function useRiskControlAmlManualQueryFlow() {
  const formOpen = ref(false);
  const verifyOpen = ref(false);

  function openForm() {
    closeAllAnchoredTooltips();
    formOpen.value = true;
  }

  function closeForm() {
    formOpen.value = false;
  }

  function onConfigFormPageSettled() {
    // no-op
  }

  function requestSubmit() {
    verifyOpen.value = true;
  }

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function onVerifyClosed(accepted: boolean) {
    verifyOpen.value = false;
    if (!accepted) return;
    closeForm();
    showAppEndFeedbackAfterOverlay();
  }

  const overlaySurface = {
    formOpen,
    verifyOpen,
    openForm,
    closeForm,
    onConfigFormPageSettled,
    requestSubmit,
    submitTradePassword,
    onVerifyClosed,
  };

  return {
    formOpen,
    openForm,
    closeForm,
    onConfigFormPageSettled,
    requestSubmit,
    overlaySurface,
  };
}
