<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  deletedMemberRecordIds,
  markManageMemberRecordDeleted,
} from './manageMemberDeletedRecordIds';
import { buildManageMemberRecordRows } from './memberRecordData';
import { resolveManageMemberRecordConfig } from './memberRecordConfigs';
import {
  registerManageMemberOverlay,
  type ManageMemberVerifyIntent,
} from './manageMemberOverlayContext';
import { manageMemberFlowKey } from './manageMemberFlowContext';
import styles from '../webhook/WebhookModuleHost.module.css';

defineProps<{
  menuItem: string;
}>();

const detailOpen = ref(false);
const detailRow = ref<PaymentEngineRecordRow | null>(null);

const verifyOpen = ref(false);
const deleteDialogOpen = ref(false);
const deleteTargetRow = ref<PaymentEngineRecordRow | null>(null);
const verifyIntent = ref<ManageMemberVerifyIntent>('delete-member');
const pendingDeleteRow = ref<PaymentEngineRecordRow | null>(null);
let endFeedbackPendingAfterVerify = false;

function resolveConfig(menuItem: string) {
  const config = resolveManageMemberRecordConfig(menuItem);
  if (!config) throw new Error(`Unknown manage member menu: ${menuItem}`);
  return config;
}

function buildMemberListRows(menuItem: string, count: number) {
  void deletedMemberRecordIds.value;
  return buildManageMemberRecordRows(menuItem, count);
}

function openDetailForRow(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

function finishDeleteMember(row: PaymentEngineRecordRow) {
  if (detailRow.value?.id === row.id) {
    detailOpen.value = false;
    detailRow.value = null;
  }
}

function requestVerify(intent: ManageMemberVerifyIntent, row?: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  verifyIntent.value = intent;
  pendingDeleteRow.value = intent === 'delete-member' ? (row ?? null) : null;
  verifyOpen.value = true;
}

function requestDeleteMember(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  deleteTargetRow.value = row;
  deleteDialogOpen.value = true;
}

function onDeleteConfirm() {
  if (!deleteTargetRow.value) return;
  const row = deleteTargetRow.value;
  deleteTargetRow.value = null;
  deleteDialogOpen.value = false;
  requestVerify('delete-member', row);
}

function onDeleteCancel() {
  deleteDialogOpen.value = false;
  deleteTargetRow.value = null;
}

function onVerifySucceeded() {
  endFeedbackPendingAfterVerify = true;
  if (verifyIntent.value === 'delete-member' && pendingDeleteRow.value) {
    markManageMemberRecordDeleted(pendingDeleteRow.value.id);
    finishDeleteMember(pendingDeleteRow.value);
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

function onMemberRowClick(row: PaymentEngineRecordRow): boolean {
  openDetailForRow(row);
  return true;
}

provide(manageMemberFlowKey, {
  openDetailForRow,
  requestDeleteMember,
});

onMounted(() => {
  registerManageMemberOverlay({
    detailOpen,
    detailRow,
    verifyOpen,
    deleteDialogOpen,
    requestDeleteMember,
    requestVerify,
    onVerifySucceeded,
    onVerifyClosed,
    onDeleteConfirm,
    onDeleteCancel,
  });
});

onBeforeUnmount(() => {
  registerManageMemberOverlay(null);
});
</script>

<template>
  <div :class="styles.contentLayer">
    <PaymentEngineDataListPage
      :menu-item="menuItem"
      :resolve-config="resolveConfig"
      :build-rows="buildMemberListRows"
      :open-detail-on-row-click="false"
      :row-click-handler="onMemberRowClick"
    />
  </div>
</template>
