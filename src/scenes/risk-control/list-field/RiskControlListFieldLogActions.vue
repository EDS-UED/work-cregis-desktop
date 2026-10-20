<script setup lang="ts">
import { computed } from 'vue';
import { EgButton, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import {
  RISK_CONTROL_LOG_ACTION_PLACEHOLDER,
  riskControlLogRowHasActionButton,
} from '@/scenes/risk-control/riskControlLogRowHasActionButton';
import styles from './RiskControlListFieldLogActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const showsActionButton = computed(() => riskControlLogRowHasActionButton(props.row));

function onViewClick() {
  const flow = paymentEngineDetailFlowRegistry.value;
  if (!flow) return;
  flow.openDetailForRow(props.row, 'Logs');
}
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      v-if="showsActionButton"
      variant="solid"
      size="sm"
      tone="decor"
      @click="onViewClick"
    >
      {{ ui('View') }}
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
