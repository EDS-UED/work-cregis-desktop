<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';
import fieldStyles from './RiskControlListFieldAutoRuleNameId.module.css';

defineProps<{
  row: PaymentEngineRecordRow;
}>();
</script>

<template>
  <div :class="[styles.host, fieldStyles.host]">
    <EgListFieldOverflowText
      :text="row.ruleName ?? row.id"
      variant="primary"
      :class="fieldStyles.nameText"
    />
    <EgListFieldOverflowText
      :text="row.ruleNumber ?? row.merchantOrderId ?? row.id"
      variant="secondary"
      tabular
    />
  </div>
</template>
