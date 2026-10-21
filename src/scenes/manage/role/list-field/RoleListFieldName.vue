<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './RoleListFieldName.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const roleName = computed(() => props.row.ruleName?.trim() || '');
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <EgListFieldOverflowText
      :text="roleName"
      variant="primary"
      tooltip-trigger="hover"
    />
  </div>
</template>
