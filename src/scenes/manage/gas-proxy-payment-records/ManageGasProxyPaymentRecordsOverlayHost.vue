<script setup lang="ts">
import { computed } from 'vue';
import ManageGasProxyPaymentRecordDetailPopup from './ManageGasProxyPaymentRecordDetailPopup.vue';
import { manageGasProxyPaymentRecordsOverlayRegistry } from './manageGasProxyPaymentRecordsOverlayContext';

const surface = computed(() => manageGasProxyPaymentRecordsOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);
</script>

<template>
  <ManageGasProxyPaymentRecordDetailPopup
    v-if="surface"
    v-model:open="detailOpen"
    :row="detailRow"
  />
</template>
