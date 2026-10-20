<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveWebhookConfigCreatorAvatarColorSeed } from '../filter/buildWebhookConfigCreatorFilterOptions';
import { formatWebhookCreatorDisplay } from '../webhookMockData';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() => {
  const name = props.row.logOperatorName?.trim() || 'Treasury';
  const email = props.row.webhookCreatorEmail?.trim() || 'treasury@cregis.com';
  const display =
    props.row.webhookCreatorDisplay?.trim()
    || formatWebhookCreatorDisplay(name, email);

  return {
    value: display,
    secondaryValue: props.row.createdAt,
    initiatorIconKind: 'avatar',
    lineLayout: 'double',
    tooltipTrigger: 'hover',
    avatarColorSeed: resolveWebhookConfigCreatorAvatarColorSeed(name),
  };
});
</script>

<template>
  <TasksListFieldGeneralStructure :customize="customize" />
</template>
