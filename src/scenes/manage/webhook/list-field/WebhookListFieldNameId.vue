<script setup lang="ts">
import { EgListFieldHashLikeLine } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './WebhookListFieldNameId.module.css';

defineProps<{
  row: PaymentEngineRecordRow;
}>();
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <EgListFieldHashLikeLine
        :text="row.ruleName ?? ''"
        variant="primary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
      <EgListFieldHashLikeLine
        :text="row.id"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
