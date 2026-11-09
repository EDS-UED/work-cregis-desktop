<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, withDefaults } from 'vue';
import { EgDetail } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import LayoutChromeScrollPageChrome from '@/scenes/project/LayoutChromeScrollPageChrome.vue';
import { formatElapsedDuration } from '@/scenes/tasks/signing/batch/batchSigningTaskStore';
import { buildPaymentEngineCollectionDetailConditionSections } from './buildPaymentEngineCollectionDetailSections';
import { buildPaymentEngineCollectionDetailView } from './paymentEngineCollectionDetailView';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import PaymentEngineCollectionDetailPageBody from './PaymentEngineCollectionDetailPageBody.vue';
import type {
  PaymentEngineCollectionDetailLineRecord,
  PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import styles from './PaymentEngineCollectionDetailPage.module.css';

const props = withDefaults(
  defineProps<{
    detail: PaymentEngineRecordRow;
    menuItem: string;
    embeddedInPageStack?: boolean;
    toolbarTitleKey?: string;
  }>(),
  {
    embeddedInPageStack: false,
    toolbarTitleKey: 'Collection Details',
  },
);

const emit = defineEmits<{
  back: [];
}>();

const { ui, locale } = useAppI18n();
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer !== undefined) clearInterval(timer);
});

const detailView = computed(() => {
  void locale.value;
  return buildPaymentEngineCollectionDetailView(props.detail);
});

const conditionSections = computed(() =>
  buildPaymentEngineCollectionDetailConditionSections(detailView.value, ui),
);

const elapsedTime = computed(() =>
  formatElapsedDuration(detailView.value.progress.runningStartedAt, now.value),
);

const recordTabLabels = computed(() =>
  detailView.value.recordTabs.map((tab) => ui(tab.labelKey)),
);

const activeTab = ref(0);
const displayRecordLines = ref<PaymentEngineCollectionDetailLineRecord[]>([]);
const activeTabKind = computed(
  () => detailView.value.recordTabs[activeTab.value]?.kind ?? 'collection',
);
const activeRecordLines = computed(
  () => detailView.value.recordsByTab[activeTabKind.value],
);
const headlineStatusLabel = computed(() =>
  ui(detailView.value.headline.status.labelKey),
);
const headlineAlert = computed(() => {
  if (detailView.value.alert === 'account-balance-insufficient') {
    return {
      type: 'notes' as const,
      text: ui('Team subscription account balance insufficient, please recharge in time'),
    };
  }
  if (detailView.value.alert === 'miner-fee-insufficient') {
    return { type: 'danger' as const, text: ui('Miner fee insufficient') };
  }
  if (detailView.value.alert === 'team-account-balance-insufficient') {
    return { type: 'danger' as const, text: ui('Team account balance insufficient') };
  }
  return null;
});

const scrollContentRevision = computed(
  () => `${props.detail.id}:${activeTab.value}:${elapsedTime.value}`,
);

watch(
  activeRecordLines,
  (lines) => {
    displayRecordLines.value = [...lines];
  },
  { immediate: true },
);

watch(
  () => props.detail.id,
  () => {
    activeTab.value = 0;
  },
);
</script>

<template>
  <LayoutChromeScrollPageChrome
    v-if="props.embeddedInPageStack"
    :title="ui(props.toolbarTitleKey)"
    :content-revision="scrollContentRevision"
    :show-paginer="activeRecordLines.length > 0"
    :scroll-content-class="styles.collectionDetailScrollContent"
    @back="emit('back')"
  >
    <PaymentEngineCollectionDetailPageBody
      v-model:active-tab="activeTab"
      in-page-stack
      :detail-id="detail.id"
      :detail-view="detailView"
      :condition-sections="conditionSections"
      :headline-status-label="headlineStatusLabel"
      :headline-alert="headlineAlert"
      :elapsed-time="elapsedTime"
      :record-tab-labels="recordTabLabels"
      :active-tab-kind="activeTabKind"
      :active-record-lines="activeRecordLines"
      v-model:display-record-lines="displayRecordLines"
    />
    <template #paginer>
      <div :class="styles.collectionDetailPaginerShell">
        <SigningBatchDataListPaginerBar
          :key="`${detail.id}-${activeTabKind}`"
          :items="activeRecordLines"
          @paginated-change="displayRecordLines = $event"
        />
      </div>
    </template>
  </LayoutChromeScrollPageChrome>
  <div
    v-else
    :class="[styles.pageRoot, styles.pageRootStandalone]"
  >
    <div :class="styles.detailHost">
      <EgDetail
        :toolbar-page-key="detail.id"
        :show-tabs="false"
        :sections="[]"
        :show-toolbar="false"
        :show-eyebrow="false"
        :show-status-tag="false"
        headline=""
      >
        <template #body>
          <PaymentEngineCollectionDetailPageBody
            v-model:active-tab="activeTab"
            :detail-id="detail.id"
            :detail-view="detailView"
            :condition-sections="conditionSections"
            :headline-status-label="headlineStatusLabel"
            :headline-alert="headlineAlert"
            :elapsed-time="elapsedTime"
            :record-tab-labels="recordTabLabels"
            :active-tab-kind="activeTabKind"
            :active-record-lines="activeRecordLines"
            v-model:display-record-lines="displayRecordLines"
          />
        </template>
      </EgDetail>
    </div>
  </div>
</template>
