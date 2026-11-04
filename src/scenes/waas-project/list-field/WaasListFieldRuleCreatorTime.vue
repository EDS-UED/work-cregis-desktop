<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolvePaymentRuleConfigurationRecordDetail } from '@/scenes/payment-engine/paymentEngineRuleConfigurationDetailData';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const customize = computed(() => {
  const detail = resolvePaymentRuleConfigurationRecordDetail(props.row);
  const display = `${detail.creatorName} (${detail.creatorEmailMasked})`;

  return {
    value: display,
    secondaryValue: detail.createdAt,
    initiatorIconKind: 'avatar',
    lineLayout: 'double',
    tooltipTrigger: 'hover',
    avatarColorSeed: detail.creatorAvatarName,
  };
});
</script>

<template>
  <TasksListFieldGeneralStructure :customize="customize" />
</template>
