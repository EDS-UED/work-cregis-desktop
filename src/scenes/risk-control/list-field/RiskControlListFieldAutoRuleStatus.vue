<script setup lang="ts">
import { ref, watch } from 'vue';
import { EgSwitch } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { riskControlAutoRuleFlowRegistry } from '@/scenes/risk-control/auto-rule/riskControlAutoRuleFlowContext';
import styles from '@/scenes/waas-project/list-field/WaasListFieldRuleStatus.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const localEnabled = ref(Boolean(props.row.ruleEnabled));

watch(
  () => props.row.ruleEnabled,
  (value) => {
    localEnabled.value = Boolean(value);
  },
);

function requestToggle(next: boolean) {
  riskControlAutoRuleFlowRegistry.value?.requestStatusToggle(props.row, next);
}
</script>

<template>
  <div :class="styles.host" @click.stop>
    <EgSwitch
      :model-value="localEnabled"
      :class="styles.switch"
      size="md"
      @update:model-value="requestToggle"
    />
  </div>
</template>
