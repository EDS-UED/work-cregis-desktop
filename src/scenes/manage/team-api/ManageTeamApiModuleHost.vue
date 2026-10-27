<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { buildManageTeamApiRecordRows, teamApiConfigToRow } from './teamApiRecordData';
import { resolveManageTeamApiRecordConfig } from './teamApiRecordConfigs';
import { teamApiFlowKey, type TeamApiVerifyIntent } from './teamApiFlowContext';
import {
  addTeamApiConfig,
  findTeamApiConfigById,
  removeTeamApiConfig,
  teamApiConfigs,
  updateTeamApiConfigEnabled,
} from './teamApiStore';
import { registerManageTeamApiOverlay } from './manageTeamApiOverlayContext';
import type { TeamApiConfigRecord } from './teamApiMockData';
import TeamApiCreateEditPage from './TeamApiCreateEditPage.vue';
import styles from '../webhook/WebhookModuleHost.module.css';

const props = defineProps<{
  menuItem: string;
}>();

const createPageOpen = ref(false);
const editDraft = ref<TeamApiConfigRecord | null>(null);

const detailOpen = ref(false);
const detailRow = ref<PaymentEngineRecordRow | null>(null);

const verifyOpen = ref(false);
const verifyIntent = ref<TeamApiVerifyIntent>('toggle-enabled');
const pendingRow = ref<PaymentEngineRecordRow | null>(null);
const pendingEnabled = ref<boolean | null>(null);
const pendingDeleteRow = ref<PaymentEngineRecordRow | null>(null);
const pendingCreateDraft = ref<TeamApiConfigRecord | null>(null);

const keyDialogOpen = ref(false);
const keyDialogRecord = ref<TeamApiConfigRecord | null>(null);

const deleteDialogOpen = ref(false);
const deleteTargetRow = ref<PaymentEngineRecordRow | null>(null);

const statusToggleDialogOpen = ref(false);
const statusToggleEnabling = ref(false);

let endFeedbackPendingAfterVerify = false;

watch(
  () => props.menuItem,
  () => {
    if (!createPageOpen.value) return;
    createPageOpen.value = false;
    editDraft.value = null;
  },
);

function resolveConfig(menuItem: string) {
  const config = resolveManageTeamApiRecordConfig(menuItem);
  if (!config) throw new Error(`Unknown team API menu: ${menuItem}`);
  return config;
}

function openCreate() {
  closeAllAnchoredTooltips();
  editDraft.value = null;
  createPageOpen.value = true;
}

function closeForm() {
  createPageOpen.value = false;
  editDraft.value = null;
}

function onConfigFormPageSettled() {
  if (!createPageOpen.value) {
    editDraft.value = null;
  }
}

function openDetailForRow(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  detailRow.value = row;
  detailOpen.value = true;
}

function requestViewKey(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  pendingRow.value = row;
  verifyIntent.value = 'view-key';
  verifyOpen.value = true;
}

function requestDelete(row: PaymentEngineRecordRow) {
  closeAllAnchoredTooltips();
  deleteTargetRow.value = row;
  deleteDialogOpen.value = true;
}

function onDeleteConfirm() {
  if (!deleteTargetRow.value) return;
  const row = deleteTargetRow.value;
  deleteTargetRow.value = null;
  deleteDialogOpen.value = false;
  pendingDeleteRow.value = row;
  verifyIntent.value = 'delete';
  verifyOpen.value = true;
}

function onDeleteCancel() {
  deleteDialogOpen.value = false;
  deleteTargetRow.value = null;
}

function requestToggleEnabled(row: PaymentEngineRecordRow, nextEnabled: boolean) {
  closeAllAnchoredTooltips();
  pendingRow.value = row;
  pendingEnabled.value = nextEnabled;
  statusToggleEnabling.value = nextEnabled;
  statusToggleDialogOpen.value = true;
}

function onStatusToggleConfirm() {
  statusToggleDialogOpen.value = false;
  verifyIntent.value = 'toggle-enabled';
  verifyOpen.value = true;
}

function onStatusToggleCancel() {
  statusToggleDialogOpen.value = false;
  pendingRow.value = null;
  pendingEnabled.value = null;
}

function onFormSubmit(draft: TeamApiConfigRecord) {
  if (editDraft.value) {
    closeForm();
    return;
  }
  pendingCreateDraft.value = draft;
  verifyIntent.value = 'create';
  verifyOpen.value = true;
}

function onVerifySucceeded() {
  if (verifyIntent.value === 'create' && pendingCreateDraft.value) {
    const created = addTeamApiConfig({
      name: pendingCreateDraft.value.name,
      permissionsKey: pendingCreateDraft.value.permissionsKey,
      ipWhitelist: pendingCreateDraft.value.ipWhitelist,
    });
    pendingCreateDraft.value = null;
    keyDialogRecord.value = created;
    keyDialogOpen.value = true;
    closeForm();
    return;
  }
  if (verifyIntent.value === 'view-key' && pendingRow.value) {
    const config = findTeamApiConfigById(pendingRow.value.id);
    if (config) {
      keyDialogRecord.value = { ...config };
      keyDialogOpen.value = true;
    }
    pendingRow.value = null;
    return;
  }
  endFeedbackPendingAfterVerify = true;
  if (verifyIntent.value === 'toggle-enabled' && pendingRow.value && pendingEnabled.value !== null) {
    updateTeamApiConfigEnabled(pendingRow.value.id, pendingEnabled.value);
    pendingRow.value = null;
    pendingEnabled.value = null;
  } else if (verifyIntent.value === 'delete' && pendingDeleteRow.value) {
    removeTeamApiConfig(pendingDeleteRow.value.id);
    if (detailRow.value?.id === pendingDeleteRow.value.id) {
      detailOpen.value = false;
      detailRow.value = null;
    }
    pendingDeleteRow.value = null;
  }
}

function onVerifyClosed() {
  verifyOpen.value = false;
  if (endFeedbackPendingAfterVerify) {
    endFeedbackPendingAfterVerify = false;
    if (verifyIntent.value !== 'create' && verifyIntent.value !== 'view-key') {
      showAppEndFeedbackAfterOverlay();
    }
    return;
  }
  pendingRow.value = null;
  pendingEnabled.value = null;
  pendingDeleteRow.value = null;
  pendingCreateDraft.value = null;
}

function onTeamApiRowClick(row: PaymentEngineRecordRow): boolean {
  openDetailForRow(row);
  return true;
}

function openEdit(row: PaymentEngineRecordRow) {
  const config = findTeamApiConfigById(row.id);
  if (!config) return;
  closeAllAnchoredTooltips();
  detailOpen.value = false;
  detailRow.value = null;
  editDraft.value = { ...config };
  createPageOpen.value = true;
}

function onToolbarAction(key: string) {
  if (key === 'addNew') {
    openCreate();
    return true;
  }
  return false;
}

const formMode = () => (editDraft.value ? 'edit' : 'create');

watch(
  teamApiConfigs,
  () => {
    const id = detailRow.value?.id;
    if (!id || !detailOpen.value) return;
    const config = findTeamApiConfigById(id);
    if (config) detailRow.value = teamApiConfigToRow(config);
  },
  { deep: true },
);

provide(teamApiFlowKey, {
  openDetailForRow,
  openEdit,
  requestViewKey,
  requestDelete,
  requestToggleEnabled,
  openCreate,
  draftConfig: editDraft,
  configFormOpen: createPageOpen,
  closeConfigForm: closeForm,
  onConfigFormPageSettled,
});

onMounted(() => {
  registerManageTeamApiOverlay({
    detailOpen,
    detailRow,
    verifyOpen,
    keyDialogOpen,
    keyDialogRecord,
    deleteDialogOpen,
    statusToggleDialogOpen,
    statusToggleEnabling,
    onStatusToggleConfirm,
    onStatusToggleCancel,
    onDeleteConfirm,
    onDeleteCancel,
    onVerifySucceeded,
    onVerifyClosed,
  });
});

onBeforeUnmount(() => {
  registerManageTeamApiOverlay(null);
});
</script>

<template>
  <div :class="styles.contentLayer">
    <PaymentEngineDataListPage
      :module-layout-page-stack="true"
      :menu-item="menuItem"
      :resolve-config="resolveConfig"
      :build-rows="buildManageTeamApiRecordRows"
      :open-detail-on-row-click="false"
      :row-click-handler="onTeamApiRowClick"
      :toolbar-action-handler="onToolbarAction"
    >
      <template #module-stack-create>
        <TeamApiCreateEditPage
          embedded-in-page-stack
          :mode="formMode()"
          :initial="editDraft"
          @cancel="closeForm"
          @submit="onFormSubmit"
        />
      </template>
    </PaymentEngineDataListPage>
  </div>
</template>
