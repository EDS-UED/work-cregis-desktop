<script setup lang="ts">
import { inject } from 'vue';
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { manageRoleFlowKey } from '../manageRoleFlowContext';
import styles from './RoleListFieldActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();
const manageRoleFlow = inject(manageRoleFlowKey, null);

function onDeleteClick() {
  manageRoleFlow?.requestDeleteRole(props.row);
}

function onEditPermissionsClick() {
  manageRoleFlow?.requestEditPermissions(props.row);
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
    <EgButton variant="solid" size="md" tone="decor" @click="onEditPermissionsClick">
      {{ ui('Edit Permissions') }}
    </EgButton>
  </div>
</template>
