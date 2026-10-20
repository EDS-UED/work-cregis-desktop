<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildManageRoleRecordRows } from './roleRecordData';
import { resolveManageRoleRecordConfig } from './roleRecordConfigs';
import { registerManageRoleOverlay } from './manageRoleOverlayContext';
import { manageRoleFlowKey } from './manageRoleFlowContext';
import styles from '../webhook/WebhookModuleHost.module.css';

defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<PaymentEngineRecordRow | null>(null);

function resolveConfig(menuItem: string) {
  const config = resolveManageRoleRecordConfig(menuItem);
  if (!config) throw new Error(`Unknown manage role menu: ${menuItem}`);
  return config;
}

function openDetailForRow(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

function onRoleRowClick(row: PaymentEngineRecordRow): boolean {
  openDetailForRow(row);
  return true;
}

provide(manageRoleFlowKey, { openDetailForRow });

onMounted(() => {
  registerManageRoleOverlay({
    detailOpen,
    detailRow,
  });
});

onBeforeUnmount(() => {
  registerManageRoleOverlay(null);
});
</script>

<template>
  <div :class="styles.contentLayer">
    <PaymentEngineDataListPage
      :menu-item="menuItem"
      :resolve-config="resolveConfig"
      :build-rows="buildManageRoleRecordRows"
      :open-detail-on-row-click="false"
      :row-click-handler="onRoleRowClick"
    />
  </div>
</template>
