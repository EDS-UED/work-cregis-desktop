<script setup lang="ts">
import { computed } from 'vue';
import TradePasswordVerifyPopup from '@/scenes/tasks/shared/TradePasswordVerifyPopup.vue';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';

const surface = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);

const verifyOpen = computed({
  get: () => surface.value?.verifyOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.verifyOpen.value = value;
  },
});

function onVerifyClosed(accepted: boolean) {
  surface.value?.onVerifyClosed(accepted);
}
</script>

<template>
  <template v-if="surface">
    <TradePasswordVerifyPopup
      v-model:open="verifyOpen"
      :submit="(code) => surface?.submitTradePassword(code) ?? false"
      @closed="onVerifyClosed"
    />
  </template>
</template>
