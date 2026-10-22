<script setup lang="ts">
import { computed } from 'vue';
import TradePasswordVerifyPopup from '@/scenes/tasks/shared/TradePasswordVerifyPopup.vue';
import { riskControlAmlManualQueryOverlayRegistry } from './riskControlAmlManualQueryOverlayContext';

const surface = computed(() => riskControlAmlManualQueryOverlayRegistry.value);

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
  <TradePasswordVerifyPopup
    v-if="surface"
    v-model:open="verifyOpen"
    :submit="(code) => surface?.submitTradePassword(code) ?? false"
    @closed="onVerifyClosed"
  />
</template>
