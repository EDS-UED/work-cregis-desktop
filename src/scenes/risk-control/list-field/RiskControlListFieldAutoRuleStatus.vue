<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgConfirmPopover, EgSwitch } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from '@/scenes/waas-project/list-field/WaasListFieldRuleStatus.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const localEnabled = ref(Boolean(props.row.ruleEnabled));
const pendingEnabled = ref<boolean | null>(null);

watch(
  () => props.row.ruleEnabled,
  (value) => {
    localEnabled.value = Boolean(value);
  },
);

const isOutflow = computed(() => props.row.autoRuleDirection === 'outflow');

const AML_QUERY_UNIT_FEE_USD = '0.50';

const confirmMessage = computed(() => {
  const enabling = pendingEnabled.value === true;
  const withFee = (template: string) =>
    template.replace('{fee}', AML_QUERY_UNIT_FEE_USD);
  if (isOutflow.value) {
    return enabling
      ? withFee(ui('Auto rule enable outflow confirm'))
      : ui('Auto rule disable outflow confirm');
  }
  return enabling
    ? withFee(ui('Auto rule enable inflow confirm'))
    : ui('Auto rule disable inflow confirm');
});

function requestToggle(next: boolean, openConfirm: () => void) {
  pendingEnabled.value = next;
  openConfirm();
}

function commitToggle() {
  if (pendingEnabled.value !== null) {
    localEnabled.value = pendingEnabled.value;
  }
  pendingEnabled.value = null;
}

function cancelToggle() {
  pendingEnabled.value = null;
}
</script>

<template>
  <div :class="styles.host" @click.stop>
    <EgConfirmPopover
      height-mode="adaptive"
      :title="ui('Warm reminder')"
      :message="confirmMessage"
      :confirm-label="ui('Confirm')"
      :close-label="ui('Cancel')"
      confirm-tone="decor"
      @confirm="commitToggle"
      @close="cancelToggle"
    >
      <template #trigger="{ onClick, active }">
        <EgSwitch
          :model-value="localEnabled"
          :class="styles.switch"
          size="md"
          :active="active"
          :aria-expanded="active"
          @update:model-value="(next) => requestToggle(next, onClick)"
        />
      </template>
    </EgConfirmPopover>
  </div>
</template>
