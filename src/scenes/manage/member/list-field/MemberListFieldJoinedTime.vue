<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildTasksListFieldTimeCustomize } from '@/scenes/tasks/list-field/tasksListFieldTimeDefaults';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() =>
  buildTasksListFieldTimeCustomize(props.row.createdAt ?? ''),
);
</script>

<template>
  <TasksListFieldTime :customize="customize" />
</template>
