import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { ref } from 'vue';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import {
  applyAmlExceptionHandlingOutcome,
  applyAmlManualReviewOutcome,
  type AmlManualReviewRiskLevel,
} from './riskControlAmlQueryRecordStore';
import { registerRiskControlAmlRecordDetailOverlay } from './riskControlAmlRecordDetailOverlayContext';

const MOCK_TRADE_PASSWORD = '111111';

export type AmlRecordDetailPendingAction =
  | 'blacklist'
  | 'retry'
  | 'pass'
  | 'reject'
  | 'manual-review';

export function useRiskControlAmlRecordDetailFlow() {
  const verifyOpen = ref(false);
  const pendingAction = ref<AmlRecordDetailPendingAction | null>(null);
  const queryFailedBanner = ref(false);
  const activeRecordId = ref<string | null>(null);
  const pendingManualReviewLevel = ref<AmlManualReviewRiskLevel | null>(null);

  function setActiveRecordId(recordId: string | null) {
    activeRecordId.value = recordId;
  }

  function commitAction(action: AmlRecordDetailPendingAction) {
    closeAllAnchoredTooltips();
    pendingAction.value = action;
    verifyOpen.value = true;
  }

  function confirmBlacklist() {
    commitAction('blacklist');
  }

  function confirmRetry() {
    commitAction('retry');
  }

  function confirmPass() {
    commitAction('pass');
  }

  function confirmReject() {
    commitAction('reject');
  }

  function onManualReviewSubmit(level: AmlManualReviewRiskLevel) {
    pendingManualReviewLevel.value = level;
    commitAction('manual-review');
  }

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function onVerifyClosed(accepted: boolean) {
    verifyOpen.value = false;
    const action = pendingAction.value;
    pendingAction.value = null;
    if (!accepted || !action) return;

    const recordId = activeRecordId.value;
    if (
      recordId
      && (action === 'retry' || action === 'pass' || action === 'reject')
    ) {
      applyAmlExceptionHandlingOutcome(recordId, action);
    }
    if (recordId && action === 'manual-review' && pendingManualReviewLevel.value) {
      applyAmlManualReviewOutcome(recordId, pendingManualReviewLevel.value);
    }
    pendingManualReviewLevel.value = null;

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
    verifyOpen,
    queryFailedBanner,
    confirmBlacklist,
    confirmRetry,
    confirmPass,
    confirmReject,
    onManualReviewSubmit,
    submitTradePassword,
    onVerifyClosed,
  };

  return {
    overlaySurface,
    mountOverlayRegistry,
    unmountOverlayRegistry,
    queryFailedBanner,
    setActiveRecordId,
  };
}
