<script setup lang="ts">
import { computed } from 'vue';
import TradePasswordVerifyPopup from '@/scenes/tasks/shared/TradePasswordVerifyPopup.vue';
import ManageOverviewGasProxyAlertDialog from './ManageOverviewGasProxyAlertDialog.vue';
import ManageOverviewGasProxyToggleConfirmDialog from './ManageOverviewGasProxyToggleConfirmDialog.vue';
import { manageOverviewOverlayRegistry } from './manageOverviewOverlayContext';

const surface = computed(() => manageOverviewOverlayRegistry.value);

const confirmDialogOpen = computed({
  get: () => surface.value?.confirmDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.confirmDialogOpen.value = value;
  },
});

const confirmEnabling = computed(() => surface.value?.confirmEnabling.value ?? false);

const verifyOpen = computed({
  get: () => surface.value?.verifyOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.verifyOpen.value = value;
  },
});

const noPermissionDialogOpen = computed({
  get: () => surface.value?.noPermissionDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.noPermissionDialogOpen.value = value;
  },
});

const setTransactionPasswordDialogOpen = computed({
  get: () => surface.value?.setTransactionPasswordDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.setTransactionPasswordDialogOpen.value = value;
  },
});

function onVerifyClosed(accepted: boolean) {
  surface.value?.onVerifyClosed(accepted);
}

</script>

<template>
  <template v-if="surface">
    <ManageOverviewGasProxyAlertDialog
      v-model:open="noPermissionDialogOpen"
      title-key="Warm reminder"
      message-key="Overview Gas Proxy No Permission Message"
    />

    <ManageOverviewGasProxyAlertDialog
      v-model:open="setTransactionPasswordDialogOpen"
      title-key="Warm reminder"
      message-key="Overview Gas Proxy Set Transaction Password Message"
    />

    <ManageOverviewGasProxyToggleConfirmDialog
      v-model:open="confirmDialogOpen"
      :enabling="confirmEnabling"
      @confirm="surface.confirmToggleDialog()"
      @cancel="surface.cancelToggleDialog()"
    />

    <TradePasswordVerifyPopup
      v-model:open="verifyOpen"
      :submit="(code) => surface!.submitTradePassword(code)"
      @closed="onVerifyClosed"
    />
  </template>
</template>
