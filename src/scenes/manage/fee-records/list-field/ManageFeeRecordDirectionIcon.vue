<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '@eds/desktop-components';
import styles from './ManageFeeRecordDirectionIcon.module.css';

const props = defineProps<{
  direction: 'income' | 'expense';
}>();

const isIncome = computed(() => props.direction === 'income');

const iconName = computed(() =>
  isIncome.value ? 'eds-arrow-entry-mini' : 'eds-arrow-outflow-mini',
);
</script>

<template>
  <span
    :class="[
      styles.directionIcon,
      isIncome ? styles.directionIconIncome : styles.directionIconExpense,
    ]"
    aria-hidden="true"
  >
    <span :class="styles.directionIconGlyph">
      <EgIcon :name="iconName" fit />
    </span>
  </span>
</template>
