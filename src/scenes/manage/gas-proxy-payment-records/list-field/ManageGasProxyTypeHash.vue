<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldHashLikeLine, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { GasProxyPaymentRecordRow } from '../gasProxyPaymentRecordTypes';
import styles from './ManageGasProxyTypeHash.module.css';

const props = defineProps<{
  row: GasProxyPaymentRecordRow;
}>();

const { ui } = useAppI18n();

const transactionTypeLabel = computed(() => ui(props.row.transactionTypeKey));
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span :class="styles.combo">
      <EgListFieldOverflowText
        :text="transactionTypeLabel"
        variant="primary"
        tooltip-trigger="hover"
      />
      <EgListFieldHashLikeLine
        :text="row.txHash"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
