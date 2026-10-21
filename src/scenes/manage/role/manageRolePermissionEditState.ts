import { computed, ref, watch, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildManageRolePermissionValueSlots } from './manageRolePermissionValueSlots';

export type ManageRolePermissionExitIntent = 'close-detail' | 'leave-edit';

export function useManageRolePermissionEditState(
  row: Ref<PaymentEngineRecordRow | null>,
  popupOpen: Ref<boolean>,
) {
  const permissionsEditing = ref(false);
  const permissionStates = ref<Record<string, boolean>>({});
  const savedSnapshot = ref<Record<string, boolean>>({});

  function resetPermissionStatesFromRow() {
    if (!row.value) {
      permissionStates.value = {};
      savedSnapshot.value = {};
      return;
    }
    const next: Record<string, boolean> = {};
    for (const slot of buildManageRolePermissionValueSlots(row.value.id)) {
      next[slot.key] = slot.enabled;
    }
    permissionStates.value = next;
    savedSnapshot.value = { ...next };
  }

  watch(
    () => row.value?.id,
    () => {
      permissionsEditing.value = false;
      resetPermissionStatesFromRow();
    },
    { immediate: true },
  );

  watch(popupOpen, (open) => {
    if (!open) {
      permissionsEditing.value = false;
      resetPermissionStatesFromRow();
    }
  });

  const isPermissionDraftDirty = computed(() => {
    if (!permissionsEditing.value) return false;
    const current = permissionStates.value;
    const saved = savedSnapshot.value;
    return Object.keys(current).some((key) => current[key] !== saved[key]);
  });

  function setPermissionEnabled(key: string, enabled: boolean) {
    permissionStates.value = {
      ...permissionStates.value,
      [key]: enabled,
    };
  }

  function enterPermissionEdit() {
    permissionsEditing.value = true;
  }

  function revertPermissionDraft() {
    permissionStates.value = { ...savedSnapshot.value };
  }

  function commitPermissionDraft() {
    savedSnapshot.value = { ...permissionStates.value };
    permissionsEditing.value = false;
  }

  function leavePermissionEditWithoutSave() {
    revertPermissionDraft();
    permissionsEditing.value = false;
  }

  return {
    permissionsEditing,
    permissionStates,
    isPermissionDraftDirty,
    setPermissionEnabled,
    enterPermissionEdit,
    commitPermissionDraft,
    leavePermissionEditWithoutSave,
  };
}
