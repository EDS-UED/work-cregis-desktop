<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldHashLikeLine } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './WebhookListFieldNameId.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const eventLabel = computed(() =>
  ui(props.row.webhookEventKey ?? 'Dangerous transaction'),
);
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
        :text="eventLabel"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
