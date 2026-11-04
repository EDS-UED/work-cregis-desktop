<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import ManageGasProxyPaymentRecordsDataListPage from './ManageGasProxyPaymentRecordsDataListPage.vue';
import { registerManageGasProxyPaymentRecordsOverlay } from './manageGasProxyPaymentRecordsOverlayContext';
import type { GasProxyPaymentRecordRow } from './gasProxyPaymentRecordTypes';

const props = defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<GasProxyPaymentRecordRow | null>(null);

watch(
  () => props.menuItem,
  () => {
    detailOpen.value = false;
    detailRow.value = null;
  },
);

function openDetailForRow(row: GasProxyPaymentRecordRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

onMounted(() => {
  registerManageGasProxyPaymentRecordsOverlay({
    detailOpen,
    detailRow,
  });
});

onBeforeUnmount(() => {
  registerManageGasProxyPaymentRecordsOverlay(null);
});
</script>

<template>
  <ManageGasProxyPaymentRecordsDataListPage @row-click="openDetailForRow" />
</template>
