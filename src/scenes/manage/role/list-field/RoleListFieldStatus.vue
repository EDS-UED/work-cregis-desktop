<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { EgSwitch } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { manageRoleFlowKey } from '../manageRoleFlowContext';
import { resolveManageRoleRecordEnabled } from '../manageRoleRecordEnabled';
import styles from '@/scenes/manage/webhook/list-field/WebhookListFieldStatus.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const flow = inject(manageRoleFlowKey, null);

const localEnabled = ref(resolveManageRoleRecordEnabled(props.row));

watch(
  () => [props.row.id, props.row.ruleEnabled],
  () => {
    localEnabled.value = resolveManageRoleRecordEnabled(props.row);
  },
);

const displayEnabled = computed(() => resolveManageRoleRecordEnabled(props.row));

watch(displayEnabled, (value) => {
  localEnabled.value = value;
});

function onUpdate(next: boolean) {
  localEnabled.value = resolveManageRoleRecordEnabled(props.row);
  flow?.requestToggleEnabled(props.row, next);
}
</script>

<template>
  <div :class="styles.host" @click.stop>
    <EgSwitch
      :model-value="localEnabled"
      size="md"
      @update:model-value="onUpdate"
    />
  </div>
</template>
