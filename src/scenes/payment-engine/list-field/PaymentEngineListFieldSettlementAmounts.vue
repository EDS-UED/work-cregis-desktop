<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { buildSettlementAmountsComboCustomize } from '../paymentEngineListFieldCustomize';
import styles from './PaymentEngineListField.shared.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
  columnMinWidth?: string;
  alignEnd?: boolean;
}>();

const customize = computed(() =>
  buildSettlementAmountsComboCustomize(
    props.row,
    props.columnMinWidth ?? '',
    Boolean(props.alignEnd),
  ),
);
</script>

<template>
  <div :class="[styles.host, alignEnd && styles.hostAlignEnd]">
    <TasksListFieldAmount :customize="customize" />
  </div>
</template>
