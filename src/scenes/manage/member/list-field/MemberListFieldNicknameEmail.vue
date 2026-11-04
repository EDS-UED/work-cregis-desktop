<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveWebhookConfigCreatorAvatarColorSeed } from '@/scenes/manage/webhook/filter/buildWebhookConfigCreatorFilterOptions';
import { formatWebhookCreatorDisplay } from '@/scenes/manage/webhook/webhookMockData';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() => {
  const name = props.row.logOperatorName?.trim() || props.row.id;
  const email = props.row.webhookCreatorEmail?.trim() || '';
  const display =
    props.row.webhookCreatorDisplay?.trim()
    || formatWebhookCreatorDisplay(name, email);

  const showCreatorTag = Boolean(props.row.manageMemberShowCreatorTag);

  return {
    value: name,
    secondaryValue: email || display,
    initiatorIconKind: 'avatar',
    lineLayout: 'double',
    tooltipTrigger: 'hover',
    avatarColorSeed: resolveWebhookConfigCreatorAvatarColorSeed(name),
    showRightTag: showCreatorTag,
    rightSystemType: 'stroke-solid',
    rightLabel: 'Member list creator tag',
  };
});
</script>

<template>
  <TasksListFieldGeneralStructure :customize="customize" />
</template>
