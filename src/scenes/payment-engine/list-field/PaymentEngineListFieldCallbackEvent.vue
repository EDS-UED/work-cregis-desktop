<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText, EgTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveCallbackEventLabelKey } from '../paymentEngineListFieldCustomize';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import styles from './PaymentEngineListField.shared.module.css';

const props = withDefaults(
  defineProps<{
    row: PaymentEngineRecordRow;
    showTriggerModeTag?: boolean;
  }>(),
  {
    showTriggerModeTag: true,
  },
);

const { ui } = useAppI18n();

const eventLabel = computed(() => ui(resolveCallbackEventLabelKey(props.row.callbackEventType)));
const triggerMode = computed(() => props.row.callbackTriggerMode ?? 'auto');
const eventId = computed(
  () => props.row.callbackEventId ?? props.row.merchantOrderId,
);
</script>

<template>
  <div :class="styles.host">
    <div :class="styles.callbackEventTitleRow">
      <EgListFieldOverflowText :text="eventLabel" variant="primary" />
      <EgTag
        v-if="showTriggerModeTag"
        size="sm"
        family="system"
        system-type="gray"
        truncate
      >
        {{ ui(triggerMode === 'manual' ? 'Manual' : 'Auto') }}
      </EgTag>
    </div>
    <EgListFieldOverflowText :text="eventId" variant="secondary" tabular />
  </div>
</template>
