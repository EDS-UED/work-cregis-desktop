<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './RiskControlListFieldAutoRuleScope.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const scopeText = computed(() => {
  const scopeKey = props.row.autoRuleScopeKey?.trim();
  if (scopeKey) return ui(scopeKey);
  if (props.row.autoRuleDirection === 'inflow') {
    return props.row.autoRuleWaasProject?.trim() || ui('WaaS Project');
  }
  return ui('Manual Transfer');
});
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="scopeText" variant="primary" />
  </div>
</template>
