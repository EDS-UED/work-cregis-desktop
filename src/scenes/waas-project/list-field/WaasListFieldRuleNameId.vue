<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';

defineProps<{
  ruleName: string;
  ruleNumber: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="ruleName" variant="primary" />
    <EgListFieldOverflowText :text="ruleNumber" variant="secondary" tabular />
  </div>
</template>
