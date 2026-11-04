<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import ManageOrderManagementDataListPage from './ManageOrderManagementDataListPage.vue';
import { registerManageOrderManagementOverlay } from './manageOrderManagementOverlayContext';
import type { OrderManagementRow } from './orderManagementTypes';

const props = defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<OrderManagementRow | null>(null);

watch(
  () => props.menuItem,
  () => {
    detailOpen.value = false;
    detailRow.value = null;
  },
);

function openDetailForRow(row: OrderManagementRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

onMounted(() => {
  registerManageOrderManagementOverlay({
    detailOpen,
    detailRow,
  });
});

onBeforeUnmount(() => {
  registerManageOrderManagementOverlay(null);
});
</script>

<template>
  <ManageOrderManagementDataListPage @row-click="openDetailForRow" />
</template>
