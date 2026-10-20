<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgStatusTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from '@/scenes/tasks/list-field/TasksListFieldStatus.module.css';
import {
  resolveWebhookPushRecordStatusKey,
  resolveWebhookPushRecordStatusLabelKey,
  resolveWebhookPushRecordStatusTagStatus,
} from '../webhookPushRecordStatusLabels';
import {
  useWebhookPushRetryProgress,
  WEBHOOK_PUSH_RETRY_TOTAL,
} from '../useWebhookPushRetryProgress';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();
const rowRef = toRef(props, 'row');
const { retryStep } = useWebhookPushRetryProgress(rowRef);

const statusKey = computed(() => resolveWebhookPushRecordStatusKey(props.row));

const tagLabel = computed(() => {
  if (statusKey.value === 'retrying') {
    return ui('Retrying push progress label')
      .replace('{current}', String(retryStep.value))
      .replace('{total}', String(WEBHOOK_PUSH_RETRY_TOTAL));
  }
  return ui(resolveWebhookPushRecordStatusLabelKey(statusKey.value));
});

const tagStatus = computed(() => resolveWebhookPushRecordStatusTagStatus(statusKey.value));
</script>

<template>
  <div :class="styles.statusPreview">
    <EgStatusTag :status="tagStatus" size="lg">
      {{ tagLabel }}
    </EgStatusTag>
  </div>
</template>
