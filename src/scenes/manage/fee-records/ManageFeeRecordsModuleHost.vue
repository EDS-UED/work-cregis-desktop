<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import ManageFeeRecordsDataListPage from './ManageFeeRecordsDataListPage.vue';
import { registerManageFeeRecordsOverlay } from './manageFeeRecordsOverlayContext';
import type { FeeRecordRow } from './feeRecordTypes';

const props = defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<FeeRecordRow | null>(null);

watch(
  () => props.menuItem,
  () => {
    detailOpen.value = false;
    detailRow.value = null;
  },
);

function openDetailForRow(row: FeeRecordRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

onMounted(() => {
  registerManageFeeRecordsOverlay({
    detailOpen,
    detailRow,
  });
});

onBeforeUnmount(() => {
  registerManageFeeRecordsOverlay(null);
});
</script>

<template>
  <ManageFeeRecordsDataListPage @row-click="openDetailForRow" />
</template>
