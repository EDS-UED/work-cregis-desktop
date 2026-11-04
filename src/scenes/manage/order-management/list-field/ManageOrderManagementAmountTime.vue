<script setup lang="ts">
import PaymentEngineListFieldMeta from '@/scenes/payment-engine/list-field/PaymentEngineListFieldMeta.vue';
import type { OrderManagementRow } from '../orderManagementTypes';

defineProps<{
  row: OrderManagementRow;
}>();
</script>

<template>
  <PaymentEngineListFieldMeta
    :primary="row.amountDisplay"
    :secondary="row.orderPlacedTime"
  />
</template>
