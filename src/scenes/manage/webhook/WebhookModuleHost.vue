<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  MANAGE_WEBHOOK_CONFIG_MENU_ITEM,
  MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM,
} from '../manageMenuData';
import { buildManageWebhookRecordRows } from './webhookRecordData';
import { resolveManageWebhookRecordConfig } from './webhookRecordConfigs';
import WebhookCreateEditPage from './WebhookCreateEditPage.vue';
import { registerManageWebhookOverlay } from './manageWebhookOverlayContext';
import type { WebhookConfigRecord } from './webhookMockData';
import {
  addWebhookConfig,
  findWebhookConfigById,
  markPushRecordRetried,
  removeWebhookConfig,
  updateWebhookConfig,
  updateWebhookConfigEnabled,
} from './webhookStore';
import { webhookFlowKey, type WebhookVerifyIntent } from './webhookFlowContext';
import { registerWebhookModuleShellApi } from './webhookModuleShellApi';
import { filterWebhookPushRecordsRepushEligible } from './webhookPushRecordRepush';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import styles from './WebhookModuleHost.module.css';

const props = defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();

const createPageOpen = ref(false);
const editDraft = ref<WebhookConfigRecord | null>(null);
const verifyOpen = ref(false);
const verifyIntent = ref<WebhookVerifyIntent>('create');
const pendingRow = ref<PaymentEngineRecordRow | null>(null);
const pendingEnabled = ref<boolean | null>(null);
const pendingCreateDraft = ref<WebhookConfigRecord | null>(null);

const keyDialogOpen = ref(false);
const keyDialogRecord = ref<WebhookConfigRecord | null>(null);
const keyDialogOneTime = ref(false);

const pushDetailOpen = ref(false);
const pushDetailRow = ref<PaymentEngineRecordRow | null>(null);

const deleteDialogOpen = ref(false);
const deleteTargetRow = ref<PaymentEngineRecordRow | null>(null);
const pendingBatchRepushIds = ref<string[]>([]);
const repushSettledCallback = ref<(() => void) | null>(null);

watch(
  () => props.menuItem,
  () => {
    if (!createPageOpen.value) return;
    createPageOpen.value = false;
    editDraft.value = null;
  },
);

function resolveConfig(menuItem: string) {
  const config = resolveManageWebhookRecordConfig(menuItem);
  if (!config) throw new Error(`Unknown webhook menu: ${menuItem}`);
  return config;
}

function openCreate() {
  closeAllAnchoredTooltips();
  editDraft.value = null;
  createPageOpen.value = true;
}

function openEdit(row: PaymentEngineRecordRow) {
  const config = findWebhookConfigById(row.id);
  if (!config) return;
  closeAllAnchoredTooltips();
  editDraft.value = { ...config };
  createPageOpen.value = true;
}

function closeForm() {
  createPageOpen.value = false;
  editDraft.value = null;
}

const WEBHOOK_QA_CREATED_KEY_DIALOG_RECORD: WebhookConfigRecord = {
  id: 'WH-QA01',
  name: 'QA Preview Hook',
  eventKey: 'Dangerous transaction',
  creatorName: 'Alex Chen',
  creatorEmail: 'alex.chen@cregis.com',
  createdAt: '2026-10-19 12:00:00',
  enabled: true,
  endpointUrl: 'https://hooks.example.com/qa-created',
  endpointVerified: true,
  secretKey: 'whsec_qa_preview_secret_key_01',
};

function openWebhookCreatedKeyDialogForQa() {
  closeAllAnchoredTooltips();
  closeForm();
  verifyOpen.value = false;
  keyDialogRecord.value = { ...WEBHOOK_QA_CREATED_KEY_DIALOG_RECORD };
  keyDialogOneTime.value = true;
  keyDialogOpen.value = true;
}

function onConfigFormPageSettled() {
  if (!createPageOpen.value) {
    editDraft.value = null;
  }
}

function startVerify(intent: WebhookVerifyIntent) {
  verifyIntent.value = intent;
  verifyOpen.value = true;
}

function onFormSubmit(draft: WebhookConfigRecord) {
  if (editDraft.value) {
    updateWebhookConfig(draft);
    closeForm();
    return;
  }
  pendingCreateDraft.value = draft;
  startVerify('create');
}

function onVerifyComplete() {
  verifyOpen.value = false;
  const intent = verifyIntent.value;

  if (intent === 'create' && pendingCreateDraft.value) {
    addWebhookConfig(pendingCreateDraft.value);
    keyDialogRecord.value = pendingCreateDraft.value;
    keyDialogOneTime.value = true;
    keyDialogOpen.value = true;
    pendingCreateDraft.value = null;
    closeForm();
    return;
  }

  if (intent === 'toggle-enabled' && pendingRow.value && pendingEnabled.value !== null) {
    updateWebhookConfigEnabled(pendingRow.value.id, pendingEnabled.value);
    pendingRow.value = null;
    pendingEnabled.value = null;
    return;
  }

  if (intent === 'view-key' && pendingRow.value) {
    const config = findWebhookConfigById(pendingRow.value.id);
    if (config) {
      keyDialogRecord.value = config;
      keyDialogOneTime.value = false;
      keyDialogOpen.value = true;
    }
    pendingRow.value = null;
    return;
  }

  if (intent === 'delete' && pendingRow.value) {
    removeWebhookConfig(pendingRow.value.id);
    pendingRow.value = null;
    deleteTargetRow.value = null;
    deleteDialogOpen.value = false;
    showAppEndFeedbackAfterOverlay();
    return;
  }

  if (intent === 'repush') {
    const batchIds = pendingBatchRepushIds.value;
    if (batchIds.length > 0) {
      for (const id of batchIds) {
        markPushRecordRetried(id);
      }
      pendingBatchRepushIds.value = [];
    } else if (pendingRow.value) {
      markPushRecordRetried(pendingRow.value.id);
    }
    pendingRow.value = null;
    repushSettledCallback.value?.();
    repushSettledCallback.value = null;
    showAppEndFeedbackAfterOverlay();
  }
}

function requestBatchRepush(
  rows: PaymentEngineRecordRow[],
  onSettled?: () => void,
) {
  const eligible = filterWebhookPushRecordsRepushEligible(rows);
  if (eligible.length === 0) return;
  pendingBatchRepushIds.value = eligible.map((row) => row.id);
  pendingRow.value = eligible[0] ?? null;
  repushSettledCallback.value = onSettled ?? null;
  startVerify('repush');
}

function onToolbarAction(key: string): boolean {
  if (key === 'addNew' && props.menuItem === MANAGE_WEBHOOK_CONFIG_MENU_ITEM) {
    openCreate();
    return true;
  }
  return false;
}

provide(webhookFlowKey, {
  openCreate,
  openEdit,
  requestToggleEnabled(row, nextEnabled) {
    pendingRow.value = row;
    pendingEnabled.value = nextEnabled;
    startVerify('toggle-enabled');
  },
  requestViewKey(row) {
    pendingRow.value = row;
    startVerify('view-key');
  },
  requestDelete(row) {
    deleteTargetRow.value = row;
    deleteDialogOpen.value = true;
  },
  openPushDetail(row) {
    pushDetailRow.value = row;
    pushDetailOpen.value = true;
  },
  requestRepush(row) {
    pendingBatchRepushIds.value = [];
    repushSettledCallback.value = null;
    pendingRow.value = row;
    startVerify('repush');
  },
  requestBatchRepush,
  draftConfig: editDraft,
  configFormOpen: createPageOpen,
  closeConfigForm: closeForm,
  onConfigFormPageSettled,
});

function onDeleteConfirm() {
  if (!deleteTargetRow.value) return;
  pendingRow.value = deleteTargetRow.value;
  deleteDialogOpen.value = false;
  startVerify('delete');
}

const formMode = () => (editDraft.value ? 'edit' : 'create');

function onPushDetailRepush() {
  if (!pushDetailRow.value) return;
  pendingBatchRepushIds.value = [];
  repushSettledCallback.value = null;
  pendingRow.value = pushDetailRow.value;
  startVerify('repush');
}

function onWebhookRowClick(row: PaymentEngineRecordRow): boolean {
  if (props.menuItem !== MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM) return false;
  pushDetailRow.value = row;
  pushDetailOpen.value = true;
  return true;
}

function onKeyDialogConfirm() {
  keyDialogOneTime.value = false;
}

onMounted(() => {
  registerWebhookModuleShellApi({
    openCreateForm: openCreate,
    openWebhookCreatedKeyDialog: openWebhookCreatedKeyDialogForQa,
  });
  registerManageWebhookOverlay({
    verifyOpen,
    onVerified: onVerifyComplete,
    keyDialogOpen,
    keyDialogRecord,
    keyDialogOneTime,
    onKeyDialogConfirm,
    pushDetailOpen,
    pushDetailRow,
    onPushDetailRepush: onPushDetailRepush,
    deleteDialogOpen,
    onDeleteConfirm: onDeleteConfirm,
    onDeleteCancel: () => {
      deleteDialogOpen.value = false;
    },
  });
});

onBeforeUnmount(() => {
  registerWebhookModuleShellApi(null);
  registerManageWebhookOverlay(null);
});
</script>

<template>
  <div :class="styles.contentLayer">
    <PaymentEngineDataListPage
      :module-layout-page-stack="menuItem === MANAGE_WEBHOOK_CONFIG_MENU_ITEM"
      :menu-item="menuItem"
      :resolve-config="resolveConfig"
      :build-rows="buildManageWebhookRecordRows"
      :open-detail-on-row-click="false"
      :toolbar-action-handler="onToolbarAction"
      :row-click-handler="onWebhookRowClick"
    >
      <template #module-stack-create>
        <WebhookCreateEditPage
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
