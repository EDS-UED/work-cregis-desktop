<script setup lang="ts">
import { inject } from 'vue';
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { manageMemberFlowKey } from '../manageMemberFlowContext';
import styles from '@/scenes/manage/role/list-field/RoleListFieldActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();
const manageMemberFlow = inject(manageMemberFlowKey, null);

function onDeleteClick() {
  manageMemberFlow?.requestDeleteMember(props.row);
}

/** 成员编辑后续规划；占位按钮，暂不接入 flow。 */
function onEditClick() {
  void props.row;
}
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton
      variant="text"
      tone="subtle"
      size="md"
      :class="styles.deleteButton"
      @click="onDeleteClick"
    >
      {{ ui('Delete') }}
    </EgButton>
    <EgButton variant="solid" size="md" tone="decor" @click="onEditClick">
      {{ ui('Edit') }}
    </EgButton>
  </div>
</template>
