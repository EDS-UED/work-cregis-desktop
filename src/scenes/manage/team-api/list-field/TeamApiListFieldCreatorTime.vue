<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() => {
  const name = props.row.logOperatorName?.trim() || 'Treasury';

  return {
    value: name,
    secondaryValue: props.row.createdAt,
    initiatorIconKind: 'avatar',
    lineLayout: 'double',
    tooltipTrigger: 'hover',
  };
});
</script>

<template>
  <TasksListFieldGeneralStructure :customize="customize" />
</template>
