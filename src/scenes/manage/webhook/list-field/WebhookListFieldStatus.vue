<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { EgSwitch } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { webhookFlowKey } from '../webhookFlowContext';
import styles from './WebhookListFieldStatus.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const flow = inject(webhookFlowKey);
const localEnabled = ref(Boolean(props.row.ruleEnabled));

watch(
  () => props.row.ruleEnabled,
  (value) => {
    localEnabled.value = Boolean(value);
  },
);

function onUpdate(next: boolean) {
  localEnabled.value = props.row.ruleEnabled ?? false;
  flow?.requestToggleEnabled(props.row, next);
}
</script>

<template>
  <div :class="styles.host" @click.stop>
    <EgSwitch
      :model-value="localEnabled"
      size="md"
      @update:model-value="onUpdate"
    />
  </div>
</template>
