<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './PaymentEngineListField.shared.module.css';

defineProps<{
  primary: string;
  secondary: string;
  alignEnd?: boolean;
}>();
</script>

<template>
  <div :class="[styles.host, alignEnd && styles.hostAlignEnd]">
    <EgListFieldOverflowText :text="primary" variant="primary" tabular />
    <EgListFieldOverflowText :text="secondary" variant="secondary" tabular />
  </div>
</template>
