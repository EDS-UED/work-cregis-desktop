<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './PaymentEngineListField.shared.module.css';

defineProps<{
  primary: string;
  secondary: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="primary" variant="primary" tabular />
    <EgListFieldOverflowText :text="secondary" variant="secondary" tabular />
  </div>
</template>
