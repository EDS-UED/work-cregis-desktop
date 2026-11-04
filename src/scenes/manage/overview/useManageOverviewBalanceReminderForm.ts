import { computed, ref } from 'vue';
import { showAppEndFeedback } from '@/composables/appEndFeedback';
import {
  createOverviewBalanceReminderFormState,
  hasAnyBalanceReminderAmountSelected,
  hasAnyBalanceReminderRecipientSelected,
  type OverviewBalanceReminderFormState,
} from './overviewBalanceReminderSkidData';

export function useManageOverviewBalanceReminderForm() {
  const form = ref<OverviewBalanceReminderFormState>(createOverviewBalanceReminderFormState());
  const showValidation = ref(false);

  const canSave = computed(() => {
    if (!form.value.featureEnabled) return true;
    return (
      hasAnyBalanceReminderAmountSelected(form.value.amountByKey) &&
      hasAnyBalanceReminderRecipientSelected(form.value.recipientById)
    );
  });

  function submit(): boolean {
    if (!canSave.value) {
      showValidation.value = true;
      return false;
    }
    showValidation.value = false;
    showAppEndFeedback();
    return true;
  }

  function resetForm() {
    form.value = createOverviewBalanceReminderFormState();
    showValidation.value = false;
  }

  return {
    form,
    showValidation,
    canSave,
    submit,
    resetForm,
  };
}
