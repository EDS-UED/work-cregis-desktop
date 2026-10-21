<script setup lang="ts">
import { computed, inject } from 'vue';
import { EgButton, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { RISK_CONTROL_LOG_ACTION_PLACEHOLDER } from '@/scenes/risk-control/riskControlLogRowHasActionButton';
import { webhookFlowKey } from '../webhookFlowContext';
import { isWebhookPushRecordRepushEligible } from '../webhookPushRecordRepush';
import styles from './WebhookListFieldPushActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();
const flow = inject(webhookFlowKey);

const showRepush = computed(
  () => props.row.webhookPushStatusKey === 'failed' && !props.row.webhookManuallyRetried,
);

function onRepush() {
  flow?.requestRepush(props.row);
}
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      v-if="showRepush"
      variant="solid"
      tone="decor"
      size="md"
      @click="onRepush"
    >
      {{ ui('Repush') }}
    </EgButton>
    <EgListFieldOverflowText
      v-else
      :text="RISK_CONTROL_LOG_ACTION_PLACEHOLDER"
      variant="primary"
      tabular
      :class="styles.placeholder"
    />
  </div>
</template>
