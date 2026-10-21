<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';
import fieldStyles from './RiskControlListFieldAutoRuleNameId.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const direction = computed(() => props.row.autoRuleDirection ?? 'inflow');
const directionLabel = computed(() =>
  direction.value === 'outflow' ? ui('Outflow') : ui('Inflow'),
);
</script>

<template>
  <div :class="[styles.host, fieldStyles.host]">
    <div :class="fieldStyles.nameRow">
      <span
        :class="[
          fieldStyles.directionBadge,
          direction === 'outflow' && fieldStyles.directionBadgeOutflow,
        ]"
        :title="directionLabel"
        aria-hidden="true"
      >
        <EgIcon
          :name="direction === 'outflow' ? 'eds-arrow-right-mini-ios' : 'eds-arrow-left-mini-ios'"
          size="sm"
          fit
        />
      </span>
      <EgListFieldOverflowText
        :text="row.ruleName ?? row.id"
        variant="primary"
        :class="fieldStyles.nameText"
      />
    </div>
    <EgListFieldOverflowText
      :text="row.ruleNumber ?? row.merchantOrderId ?? row.id"
      variant="secondary"
      tabular
    />
  </div>
</template>
