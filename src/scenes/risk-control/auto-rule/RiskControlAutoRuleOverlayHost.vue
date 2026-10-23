<script setup lang="ts">
import { computed } from 'vue';
import TradePasswordVerifyPopup from '@/scenes/tasks/shared/TradePasswordVerifyPopup.vue';
import { riskControlAutoRuleOverlayRegistry } from './riskControlAutoRuleOverlayContext';
import RiskControlAutoRuleAlertDialog from './RiskControlAutoRuleAlertDialog.vue';
import RiskControlAutoRuleDeleteConfirmDialog from './RiskControlAutoRuleDeleteConfirmDialog.vue';
import RiskControlAutoRuleSkipDisableConfirmDialog from './RiskControlAutoRuleSkipDisableConfirmDialog.vue';
import RiskControlAutoRuleStatusToggleConfirmDialog from './RiskControlAutoRuleStatusToggleConfirmDialog.vue';

const surface = computed(() => riskControlAutoRuleOverlayRegistry.value);

const noPermissionDialogOpen = computed({
  get: () => surface.value?.noPermissionDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.noPermissionDialogOpen.value = value;
  },
});

const editBlockedDialogOpen = computed({
  get: () => surface.value?.editBlockedDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.editBlockedDialogOpen.value = value;
  },
});

const verifyOpen = computed({
  get: () => surface.value?.verifyOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.verifyOpen.value = value;
  },
});

const skipDisableDialogOpen = computed({
  get: () => surface.value?.skipDisableDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.skipDisableDialogOpen.value = value;
  },
});

const deleteDialogOpen = computed({
  get: () => surface.value?.deleteDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.deleteDialogOpen.value = value;
  },
});

const statusToggleDialogOpen = computed({
  get: () => surface.value?.statusToggleDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.statusToggleDialogOpen.value = value;
  },
});

const statusToggleConfirmMessage = computed(
  () => surface.value?.statusToggleConfirmMessage.value ?? '',
);

const skipDisableMessageKey = computed(
  () => surface.value?.skipDisableMessageKey.value ?? 'Auto rule skip whitelist disable confirm',
);

function onVerifyClosed(accepted: boolean) {
  surface.value?.onVerifyClosed(accepted);
}
</script>

<template>
  <template v-if="surface">
    <RiskControlAutoRuleAlertDialog
      v-model:open="noPermissionDialogOpen"
      title-key="Warm reminder"
      message-key="Auto rule no create permission"
      :confirm-disabled="true"
    />

    <RiskControlAutoRuleAlertDialog
      v-model:open="editBlockedDialogOpen"
      title-key="Warm reminder"
      message-key="Auto rule edit requires disabled"
      confirm-label-key="Disable and edit"
      confirm-tone="danger"
      @confirm="surface?.confirmEditBlockedDisable()"
    />

    <TradePasswordVerifyPopup
      v-model:open="verifyOpen"
      :submit="(code) => surface?.submitTradePassword(code) ?? false"
      @closed="onVerifyClosed"
    />

    <RiskControlAutoRuleSkipDisableConfirmDialog
      v-model:open="skipDisableDialogOpen"
      :message-key="skipDisableMessageKey"
      @confirm="surface?.confirmSkipDisableOff()"
      @cancel="surface?.cancelSkipDisableOff()"
    />

    <RiskControlAutoRuleDeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="surface?.confirmDelete()"
      @cancel="surface?.cancelDelete()"
    />

    <RiskControlAutoRuleStatusToggleConfirmDialog
      v-model:open="statusToggleDialogOpen"
      :message="statusToggleConfirmMessage"
      @confirm="surface?.confirmStatusToggle()"
      @cancel="surface?.cancelStatusToggle()"
    />
  </template>
</template>
