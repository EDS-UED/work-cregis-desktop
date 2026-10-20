<script setup lang="ts">
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildRiskControlRecordRows } from './riskControlRecordData';
import { resolveRiskControlRecordConfig } from './riskControlRecordConfigs';
import { shouldOpenRiskControlDetailOnRowClick } from './riskControlMenuData';

defineProps<{
  menuItem: string;
}>();

function canOpenDetailOnRowClick(row: PaymentEngineRecordRow, menuItem: string): boolean {
  return shouldOpenRiskControlDetailOnRowClick(menuItem, row);
}
</script>

<template>
  <PaymentEngineDataListPage
    :menu-item="menuItem"
    :resolve-config="resolveRiskControlRecordConfig"
    :build-rows="buildRiskControlRecordRows"
    :open-detail-on-row-click="false"
    :can-open-detail-on-row-click="canOpenDetailOnRowClick"
  />
</template>
