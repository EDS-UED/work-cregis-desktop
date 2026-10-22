import { ref } from 'vue';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import { registerRiskControlAmlRecordDetailOverlay } from './riskControlAmlRecordDetailOverlayContext';

const MOCK_TRADE_PASSWORD = '111111';

export type AmlRecordDetailPendingAction =
  | 'blacklist'
  | 'retry'
  | 'pass'
  | 'reject'
  | 'manual-review';

export function useRiskControlAmlRecordDetailFlow() {
  const confirmDialogOpen = ref(false);
  const confirmMessageKey = ref('AML record confirm blacklist');
  const manualReviewDialogOpen = ref(false);
  const verifyOpen = ref(false);
  const pendingAction = ref<AmlRecordDetailPendingAction | null>(null);
  const queryFailedBanner = ref(false);

  function openConfirm(action: AmlRecordDetailPendingAction, messageKey: string) {
    pendingAction.value = action;
    confirmMessageKey.value = messageKey;
    confirmDialogOpen.value = true;
  }

  function requestBlacklist() {
    openConfirm('blacklist', 'AML record confirm blacklist');
  }

  function requestRetry() {
    openConfirm('retry', 'AML record confirm retry');
  }

  function requestPass() {
    openConfirm('pass', 'AML record confirm pass');
  }

  function requestReject() {
    openConfirm('reject', 'AML record confirm reject');
  }

  function openManualReview() {
    manualReviewDialogOpen.value = true;
  }

  function onConfirmDialogConfirm() {
    confirmDialogOpen.value = false;
    if (pendingAction.value === 'manual-review') return;
    verifyOpen.value = true;
  }

  function onConfirmDialogCancel() {
    confirmDialogOpen.value = false;
    pendingAction.value = null;
  }

  function onManualReviewSubmit() {
    manualReviewDialogOpen.value = false;
    pendingAction.value = 'manual-review';
    verifyOpen.value = true;
  }

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function onVerifyClosed(accepted: boolean) {
    verifyOpen.value = false;
    const action = pendingAction.value;
    pendingAction.value = null;
    if (!accepted || !action) return;

    if (action === 'retry') {
      queryFailedBanner.value = false;
      showAppEndFeedbackAfterOverlay('Success');
      return;
    }

    if (action === 'blacklist' || action === 'manual-review' || action === 'pass') {
      showAppEndFeedbackAfterOverlay('Success');
      return;
    }

    if (action === 'reject') {
      showAppEndFeedbackAfterOverlay('Success');
    }
  }

  function mountOverlayRegistry() {
    registerRiskControlAmlRecordDetailOverlay(overlaySurface);
  }

  function unmountOverlayRegistry() {
    registerRiskControlAmlRecordDetailOverlay(null);
  }

  const overlaySurface = {
    confirmDialogOpen,
    confirmMessageKey,
    manualReviewDialogOpen,
    verifyOpen,
    queryFailedBanner,
    requestBlacklist,
    requestRetry,
    requestPass,
    requestReject,
    openManualReview,
    onConfirmDialogConfirm,
    onConfirmDialogCancel,
    onManualReviewSubmit,
    submitTradePassword,
    onVerifyClosed,
  };

  return {
    overlaySurface,
    mountOverlayRegistry,
    unmountOverlayRegistry,
    queryFailedBanner,
  };
}
