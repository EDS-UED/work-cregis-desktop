<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './PaymentEngineListField.shared.module.css';

defineProps<{
  settlementNumber: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="settlementNumber" variant="primary" tabular />
  </div>
</template>
