<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText, EgTag } from '@eds/desktop-components';
import amountStyles from '@/scenes/tasks/list-field/TasksListFieldAmount.module.css';
import styles from './PaymentEngineListField.shared.module.css';

const props = defineProps<{
  cryptoAmount: string;
  cryptoSymbol: string;
  fiatAmount?: string;
  networkLabel?: string;
  alignEnd?: boolean;
}>();

const primaryText = computed(() => `${props.cryptoAmount} ${props.cryptoSymbol}`);
const secondaryText = computed(() => {
  const fiat = String(props.fiatAmount ?? '').trim();
  if (!fiat) return '';
  return fiat.startsWith('≈') ? fiat : `≈ ${fiat}`;
});
</script>

<template>
  <div
    :class="[amountStyles.amountPreview, alignEnd && amountStyles.amountPreviewAlignEnd]"
    :style="{ width: '100%', maxWidth: '100%', minWidth: '0' }"
  >
    <div :class="amountStyles.amountPrimaryRow">
      <EgListFieldOverflowText :text="primaryText" variant="primary" tabular />
      <EgTag
        v-if="networkLabel"
        size="sm"
        system-type="stroke-subtle"
        truncate
      >
        {{ networkLabel }}
      </EgTag>
    </div>
    <EgListFieldOverflowText
      v-if="secondaryText"
      :text="secondaryText"
      variant="secondary"
      tabular
    />
  </div>
</template>
