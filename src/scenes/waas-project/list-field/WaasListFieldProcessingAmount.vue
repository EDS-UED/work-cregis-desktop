<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import { buildWaasAmountAddressCustomize } from '@/scenes/waas-project/waasListFieldCustomize';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

const props = defineProps<{
  row: PaymentEngineRecordRow;
  columnMinWidth?: string;
}>();

const customize = computed(() =>
  buildWaasAmountAddressCustomize(props.row, props.columnMinWidth ?? ''),
);
</script>

<template>
  <TasksListFieldAmount :customize="customize" />
</template>
