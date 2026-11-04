<script setup lang="ts">
import { computed } from 'vue';
import ManageFeeRecordDetailPopup from './ManageFeeRecordDetailPopup.vue';
import { manageFeeRecordsOverlayRegistry } from './manageFeeRecordsOverlayContext';

const surface = computed(() => manageFeeRecordsOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);
</script>

<template>
  <ManageFeeRecordDetailPopup
    v-if="surface"
    v-model:open="detailOpen"
    :row="detailRow"
  />
</template>
