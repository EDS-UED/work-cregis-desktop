<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { isFeeRecordIncomeOperation } from '../feeRecordOperationDirection';
import type { FeeRecordRow } from '../feeRecordTypes';
import ManageFeeRecordDirectionIcon from './ManageFeeRecordDirectionIcon.vue';
import styles from './ManageFeeRecordOperationType.module.css';

const props = defineProps<{
  row: FeeRecordRow;
}>();

const { ui } = useAppI18n();

const direction = computed(() =>
  isFeeRecordIncomeOperation(props.row.operationTypeKey) ? 'income' : 'expense',
);

const labelText = computed(() => ui(props.row.operationTypeKey));
</script>

<template>
  <div :class="styles.row">
    <ManageFeeRecordDirectionIcon :direction="direction" />
    <EgListFieldOverflowText
      :class="styles.label"
      :text="labelText"
      variant="primary"
      tooltip-trigger="hover"
    />
  </div>
</template>
