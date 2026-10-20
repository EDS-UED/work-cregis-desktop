<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './PaymentEngineListFieldCallbackUrl.module.css';

defineProps<{
  url: string;
  alignEnd?: boolean;
}>();
</script>

<template>
  <div :class="[styles.host, alignEnd && styles.hostAlignEnd]">
    <EgListFieldOverflowText :text="url" variant="primary" tabular />
  </div>
</template>
