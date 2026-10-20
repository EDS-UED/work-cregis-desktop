<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() => ({
  value: props.row.ruleName?.trim() || '',
  initiatorIconKind: 'none',
  lineLayout: 'single',
  tooltipTrigger: 'hover',
}));
</script>

<template>
  <TasksListFieldGeneralStructure :customize="customize" />
</template>
