<script setup lang="ts">
import { computed } from 'vue';
import TradePasswordVerifyPopup from '@/scenes/tasks/shared/TradePasswordVerifyPopup.vue';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';
import RiskControlAmlRecordDetailConfirmDialog from './RiskControlAmlRecordDetailConfirmDialog.vue';
import RiskControlAmlRecordDetailManualReviewDialog from './RiskControlAmlRecordDetailManualReviewDialog.vue';

const surface = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);

const confirmDialogOpen = computed({
  get: () => surface.value?.confirmDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.confirmDialogOpen.value = value;
  },
});

const manualReviewDialogOpen = computed({
  get: () => surface.value?.manualReviewDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.manualReviewDialogOpen.value = value;
  },
});

const verifyOpen = computed({
  get: () => surface.value?.verifyOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.verifyOpen.value = value;
  },
});

const confirmMessageKey = computed(
  () => surface.value?.confirmMessageKey.value ?? 'AML record confirm blacklist',
);

function onVerifyClosed(accepted: boolean) {
  surface.value?.onVerifyClosed(accepted);
}
</script>

<template>
  <template v-if="surface">
    <RiskControlAmlRecordDetailConfirmDialog
      v-model:open="confirmDialogOpen"
      :message-key="confirmMessageKey"
      @confirm="surface.onConfirmDialogConfirm()"
      @cancel="surface.onConfirmDialogCancel()"
    />

    <RiskControlAmlRecordDetailManualReviewDialog
      v-model:open="manualReviewDialogOpen"
      @submit="surface.onManualReviewSubmit()"
      @cancel="manualReviewDialogOpen = false"
    />

    <TradePasswordVerifyPopup
      v-model:open="verifyOpen"
      :submit="(code) => surface?.submitTradePassword(code) ?? false"
      @closed="onVerifyClosed"
    />
  </template>
</template>
