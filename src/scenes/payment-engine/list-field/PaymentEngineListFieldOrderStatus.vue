<script setup lang="ts">
import { computed } from 'vue';
import { EgColorfulTag, EgStatusTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineOrderStatus } from '../paymentEngineRecordConfigs';
import {
  resolvePaymentEngineOrderStatusLabelKey,
  resolvePaymentEngineOrderStatusTagVariant,
} from '../paymentEngineOrderStatusLabels';
import styles from '@/scenes/tasks/list-field/TasksListFieldStatus.module.css';

const props = defineProps<{
  status: PaymentEngineOrderStatus;
}>();

const { ui } = useAppI18n();

const tagLabel = computed(() => ui(resolvePaymentEngineOrderStatusLabelKey(props.status)));
const tagVariant = computed(() => resolvePaymentEngineOrderStatusTagVariant(props.status));
</script>

<template>
  <div :class="styles.statusPreview">
    <EgColorfulTag
      v-if="tagVariant.kind === 'colorful'"
      :colorful-style="tagVariant.colorfulStyle"
      size="lg"
    >
      {{ tagLabel }}
    </EgColorfulTag>
    <EgStatusTag
      v-else
      :status="tagVariant.status"
      size="lg"
    >
      {{ tagLabel }}
    </EgStatusTag>
  </div>
</template>
