<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './PaymentEngineListField.shared.module.css';

defineProps<{
  orderId: string;
  merchantOrderId: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="orderId" variant="primary" tabular />
    <EgListFieldOverflowText :text="merchantOrderId" variant="secondary" tabular />
  </div>
</template>
