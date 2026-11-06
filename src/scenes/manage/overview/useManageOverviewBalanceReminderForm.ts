import { computed, ref } from 'vue';
import { createOverviewBalanceReminderFormState } from './overviewBalanceReminderSkidData';
import {
  cloneOverviewBalanceReminderFormState,
  overviewBalanceReminderReminderSettingsEqual,
} from './overviewBalanceReminderFormCompare';

export function useManageOverviewBalanceReminderForm() {
  const initial = createOverviewBalanceReminderFormState();
  const form = ref(cloneOverviewBalanceReminderFormState(initial));
  const savedForm = ref(cloneOverviewBalanceReminderFormState(initial));

  const saveEnabled = computed(() => {
    if (!form.value.featureEnabled) return false;
    return !overviewBalanceReminderReminderSettingsEqual(
      form.value,
      savedForm.value,
    );
  });

  function persistSave(): boolean {
    if (!saveEnabled.value) return false;
    savedForm.value = cloneOverviewBalanceReminderFormState(form.value);
    return true;
  }

  function resetForm() {
    const next = createOverviewBalanceReminderFormState();
    form.value = cloneOverviewBalanceReminderFormState(next);
    savedForm.value = cloneOverviewBalanceReminderFormState(next);
  }

  return {
    form,
    saveEnabled,
    persistSave,
    resetForm,
  };
}
