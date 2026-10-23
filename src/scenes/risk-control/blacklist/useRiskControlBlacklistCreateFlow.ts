import { ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { showAppEndFeedback } from '@/composables/appEndFeedback';
import {
  emptyRiskControlBlacklistCreateDraft,
  type RiskControlBlacklistCreateDraft,
} from './riskControlBlacklistCreateTypes';

export function useRiskControlBlacklistCreateFlow() {
  const formOpen = ref(false);
  const draft = ref<RiskControlBlacklistCreateDraft>(emptyRiskControlBlacklistCreateDraft());

  function openForm(preset?: RiskControlBlacklistCreateDraft) {
    closeAllAnchoredTooltips();
    draft.value = preset
      ? { ...preset }
      : emptyRiskControlBlacklistCreateDraft();
    formOpen.value = true;
  }

  function closeForm() {
    formOpen.value = false;
  }

  function onConfigFormPageSettled() {
    if (!formOpen.value) {
      draft.value = emptyRiskControlBlacklistCreateDraft();
    }
  }

  function requestSubmit() {
    closeForm();
    showAppEndFeedback('Success');
  }

  return {
    formOpen,
    draft,
    openForm,
    closeForm,
    onConfigFormPageSettled,
    requestSubmit,
  };
}
