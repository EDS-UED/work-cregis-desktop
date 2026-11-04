<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { EMPTY_DISPLAY } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import styles from './PaymentEngineListFieldRefundActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

/** 仅「未转账」展示转账操作；其余状态占位 `--`。 */
const showTransferButton = computed(() => {
  const status = props.row.status;
  return status === 'initiated' || status === 'external-pending';
});
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      v-if="showTransferButton"
      variant="solid"
      size="md"
      tone="decor"
    >
      {{ ui('Payment Engine Transfer') }}
    </EgButton>
    <span
      v-else
      :class="['typography-footnote', styles.emptyDisplay]"
    >
      {{ EMPTY_DISPLAY }}
    </span>
  </div>
</template>
