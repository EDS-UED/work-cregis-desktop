<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveEgDataListDemoRowIndex } from '@/scenes/shared/egDataListMockData';
import { EMPTY_DISPLAY } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import styles from './PaymentEngineListFieldRefundActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const showRefundButton = computed(() => resolveEgDataListDemoRowIndex(props.row) === 0);
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      v-if="showRefundButton"
      variant="solid"
      size="md"
      tone="decor"
    >
      {{ ui('Refund') }}
    </EgButton>
    <span
      v-else
      :class="['typography-footnote', styles.emptyDisplay]"
    >
      {{ EMPTY_DISPLAY }}
    </span>
  </div>
</template>
