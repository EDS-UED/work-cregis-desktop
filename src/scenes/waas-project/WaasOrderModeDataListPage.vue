<script setup lang="ts">
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { buildWaasOrderModeRecordRows } from './waasOrderModeRecordData';
import { resolveWaasOrderModeRecordConfig } from './waasOrderModeRecordConfigs';

defineProps<{
  menuItem: string;
}>();
</script>

<template>
  <PaymentEngineDataListPage
    :menu-item="menuItem"
    :resolve-config="resolveWaasOrderModeRecordConfig"
    :build-rows="buildWaasOrderModeRecordRows"
  />
</template>
