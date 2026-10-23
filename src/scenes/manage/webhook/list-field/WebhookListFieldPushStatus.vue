<script setup lang="ts">
import { computed } from 'vue';
import { EgStatusTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from '@/scenes/tasks/list-field/TasksListFieldStatus.module.css';
import {
  resolveWebhookPushRecordStatusKey,
  resolveWebhookPushRecordStatusLabelKey,
  resolveWebhookPushRecordStatusTagStatus,
} from '../webhookPushRecordStatusLabels';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const statusKey = computed(() => resolveWebhookPushRecordStatusKey(props.row));

const tagLabel = computed(() =>
  ui(resolveWebhookPushRecordStatusLabelKey(statusKey.value)),
);

const tagStatus = computed(() => resolveWebhookPushRecordStatusTagStatus(statusKey.value));
</script>

<template>
  <div :class="styles.statusPreview">
    <EgStatusTag :status="tagStatus" size="lg">
      {{ tagLabel }}
    </EgStatusTag>
  </div>
</template>
