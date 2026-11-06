<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldHashLikeLine, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';

const props = defineProps<{
  transactionTypeKey: string;
  txHash?: string;
  /** 与 txHash 二选一：交易历史/处理中列表副行展示交易时间。 */
  transactionTime?: string;
}>();

const { ui } = useAppI18n();

const transactionTypeLabel = computed(() => ui(props.transactionTypeKey));
const secondaryLineText = computed(() => {
  const time = String(props.transactionTime ?? '').trim();
  if (time) return time;
  return props.txHash?.trim() ?? '';
});
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <EgListFieldOverflowText :text="transactionTypeLabel" variant="primary" />
      <EgListFieldHashLikeLine
        :text="secondaryLineText"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
