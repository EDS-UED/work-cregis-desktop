<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldHashLikeLine, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';

const props = defineProps<{
  transactionTypeKey: string;
  txHash: string;
}>();

const { ui } = useAppI18n();

const transactionTypeLabel = computed(() => ui(props.transactionTypeKey));
const hashText = computed(() => props.txHash?.trim() ?? '');
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <EgListFieldOverflowText :text="transactionTypeLabel" variant="primary" />
      <EgListFieldHashLikeLine
        :text="hashText"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
