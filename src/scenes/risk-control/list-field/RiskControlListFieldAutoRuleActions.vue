<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { riskControlAutoRuleFlowRegistry } from '@/scenes/risk-control/auto-rule/riskControlAutoRuleFlowContext';
import { isRiskControlAutoRulesMenuItem } from '@/scenes/risk-control/riskControlMenuData';
import styles from './RiskControlListFieldAutoRuleActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
  menuItem: string;
}>();

const { ui } = useAppI18n();

function onEditClick() {
  if (!isRiskControlAutoRulesMenuItem(props.menuItem)) return;
  riskControlAutoRuleFlowRegistry.value?.startEdit(props.row);
}

function onDeleteClick() {
  if (!isRiskControlAutoRulesMenuItem(props.menuItem)) return;
  riskControlAutoRuleFlowRegistry.value?.requestDelete(props.row);
}
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      variant="text"
      tone="subtle"
      size="md"
      :class="styles.deleteButton"
      @click="onDeleteClick"
    >
      {{ ui('Delete') }}
    </EgButton>
    <EgButton variant="solid" size="md" tone="decor" @click="onEditClick">
      {{ ui('Edit') }}
    </EgButton>
  </div>
</template>
