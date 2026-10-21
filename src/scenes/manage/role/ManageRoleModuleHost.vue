<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  deletedRoleRecordIds,
  markManageRoleRecordDeleted,
} from './manageRoleDeletedRecordIds';
import { buildManageRoleRecordRows } from './roleRecordData';
import { resolveManageRoleRecordConfig } from './roleRecordConfigs';
import {
  registerManageRoleOverlay,
  type ManageRoleVerifyIntent,
} from './manageRoleOverlayContext';
import { manageRoleFlowKey } from './manageRoleFlowContext';
import styles from '../webhook/WebhookModuleHost.module.css';

defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<PaymentEngineRecordRow | null>(null);
const initialEnterEdit = ref(false);
const enterEditNonce = ref(0);

const verifyOpen = ref(false);
const deleteDialogOpen = ref(false);
const deleteTargetRow = ref<PaymentEngineRecordRow | null>(null);
const verifyIntent = ref<ManageRoleVerifyIntent>('save-permissions');
const pendingDeleteRow = ref<PaymentEngineRecordRow | null>(null);
let savePermissionsVerifiedHandler: (() => void) | null = null;
let endFeedbackPendingAfterVerify = false;

function resolveConfig(menuItem: string) {
  const config = resolveManageRoleRecordConfig(menuItem);
  if (!config) throw new Error(`Unknown manage role menu: ${menuItem}`);
  return config;
}

function buildRoleListRows(menuItem: string, count: number) {
  void deletedRoleRecordIds.value;
  return buildManageRoleRecordRows(menuItem, count);
}

function openDetailForRow(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  initialEnterEdit.value = false;
  detailRow.value = row;
  detailOpen.value = true;
}

function requestEditPermissions(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  if (detailOpen.value && detailRow.value?.id === row.id) {
    enterEditNonce.value += 1;
    return;
  }
  initialEnterEdit.value = true;
  detailRow.value = row;
  detailOpen.value = true;
}

function finishDeleteRole(row: PaymentEngineRecordRow) {
  if (detailRow.value?.id === row.id) {
    detailOpen.value = false;
    detailRow.value = null;
  }
}

function requestVerify(intent: ManageRoleVerifyIntent, row?: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  verifyIntent.value = intent;
  pendingDeleteRow.value = intent === 'delete-role' ? (row ?? null) : null;
  verifyOpen.value = true;
}

function requestDeleteRole(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  deleteTargetRow.value = row;
  deleteDialogOpen.value = true;
}

function onDeleteConfirm() {
  if (!deleteTargetRow.value) return;
  const row = deleteTargetRow.value;
  deleteTargetRow.value = null;
  deleteDialogOpen.value = false;
  requestVerify('delete-role', row);
}

function onDeleteCancel() {
  deleteDialogOpen.value = false;
  deleteTargetRow.value = null;
}

function setSavePermissionsVerifiedHandler(handler: (() => void) | null) {
  savePermissionsVerifiedHandler = handler;
}

function onVerifySucceeded() {
  endFeedbackPendingAfterVerify = true;
  if (verifyIntent.value === 'save-permissions') {
    savePermissionsVerifiedHandler?.();
    detailOpen.value = false;
    detailRow.value = null;
  } else if (verifyIntent.value === 'delete-role' && pendingDeleteRow.value) {
    markManageRoleRecordDeleted(pendingDeleteRow.value.id);
    finishDeleteRole(pendingDeleteRow.value);
    pendingDeleteRow.value = null;
  }
}

function onVerifyClosed() {
  verifyOpen.value = false;
  if (endFeedbackPendingAfterVerify) {
    endFeedbackPendingAfterVerify = false;
    showAppEndFeedbackAfterOverlay();
    return;
  }
  pendingDeleteRow.value = null;
}

function consumeInitialEnterEdit() {
  initialEnterEdit.value = false;
}

function onRoleRowClick(row: PaymentEngineRecordRow): boolean {
  openDetailForRow(row);
  return true;
}

provide(manageRoleFlowKey, {
  openDetailForRow,
  requestEditPermissions,
  requestDeleteRole,
});

onMounted(() => {
  registerManageRoleOverlay({
    detailOpen,
    detailRow,
    initialEnterEdit,
    enterEditNonce,
    verifyOpen,
    deleteDialogOpen,
    consumeInitialEnterEdit,
    requestDeleteRole,
    requestVerify,
    setSavePermissionsVerifiedHandler,
    onVerifySucceeded,
    onVerifyClosed,
    onDeleteConfirm,
    onDeleteCancel,
  });
});

onBeforeUnmount(() => {
  registerManageRoleOverlay(null);
});
</script>

<template>
  <div :class="styles.contentLayer">
    <PaymentEngineDataListPage
      :menu-item="menuItem"
      :resolve-config="resolveConfig"
      :build-rows="buildRoleListRows"
      :open-detail-on-row-click="false"
      :row-click-handler="onRoleRowClick"
    />
  </div>
</template>
