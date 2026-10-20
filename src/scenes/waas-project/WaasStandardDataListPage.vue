<script setup lang="ts">
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { buildWaasStandardRecordRows } from './waasStandardRecordData';
import { resolveWaasStandardRecordConfig } from './waasStandardRecordConfigs';
import { shouldOpenWaasStandardDetailOnRowClick } from './waasStandardMenuData';

defineProps<{
  menuItem: string;
}>();
</script>

<template>
  <PaymentEngineDataListPage
    :menu-item="menuItem"
    :resolve-config="resolveWaasStandardRecordConfig"
    :build-rows="buildWaasStandardRecordRows"
    :open-detail-on-row-click="shouldOpenWaasStandardDetailOnRowClick(menuItem)"
  />
</template>
