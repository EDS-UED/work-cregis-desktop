<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, withDefaults } from 'vue';
import {
  EgButton,
  EgDetail,
  EgDivider,
  EgIcon,
  EgProgress,
  EgTabs,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import { formatElapsedDuration } from '@/scenes/tasks/signing/batch/batchSigningTaskStore';
import {
  buildPaymentEngineCollectionDetailConditionSections,
  buildPaymentEngineCollectionDetailInitiatorText,
  buildPaymentEngineCollectionDetailMinerFeeText,
  buildPaymentEngineCollectionDetailProgressMetric,
} from './buildPaymentEngineCollectionDetailSections';
import { buildPaymentEngineCollectionDetailView } from './paymentEngineCollectionDetailView';
import PaymentEngineCollectionDetailRecordsTable from './PaymentEngineCollectionDetailRecordsTable.vue';
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
  }>(),
  {
    embeddedInPageStack: false,
  },
);

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
  detailView.value.recordTabs.labels.map((labelKey) => ui(labelKey)),
);

const activeTab = ref(0);
const displayRecordLines = ref<PaymentEngineCollectionDetailLineRecord[]>([]);

watch(
  () => detailView.value.records,
  (lines) => {
    displayRecordLines.value = lines.slice(0, 20);
  },
  { immediate: true },
);

function formatMetricCount(value: string) {
  return formatGroupedNumber(Number.parseInt(value.replace(/,/g, ''), 10) || 0);
}
</script>

<template>
  <div
    :class="[
      styles.pageRoot,
      props.embeddedInPageStack ? styles.pageRootEmbedded : styles.pageRootStandalone,
    ]"
  >
    <div :class="styles.detailHost">
      <EgDetail
        :toolbar-page-key="detail.id"
        :eyebrow="ui(detailView.headline.eyebrowKey)"
        :headline="detailView.headline.amountText"
        :show-eyebrow="true"
        :show-status-tag="true"
        :status-tag="ui(detailView.headline.status.labelKey)"
        status-tag-size="lg"
        :status-tag-status="detailView.headline.status.kind"
        :show-tabs="false"
        :sections="[]"
        :show-toolbar="false"
      >
        <template #append>
          <div :class="styles.headlineRegion">
            <div :class="styles.headlineMetaRow">
              <div :class="styles.headlineMetaItems">
                <span :class="styles.metaItem">
                  <EgIcon name="eds-wallet" size="sm" fit />
                  <span :class="styles.metaItemText">
                    {{ buildPaymentEngineCollectionDetailMinerFeeText(detailView, ui) }}
                  </span>
                </span>
                <span :class="styles.metaItem">
                  <EgIcon name="eds-user" size="sm" fit />
                  <span :class="styles.metaItemText">
                    {{ buildPaymentEngineCollectionDetailInitiatorText(detailView, ui) }}
                  </span>
                </span>
              </div>
              <EgButton variant="solid" tone="danger" size="md">
                {{ ui('Stop Collection') }}
              </EgButton>
            </div>
          </div>

          <div :class="styles.cardsRow">
            <div :class="styles.conditionCard">
              <EgDetail
                :sections="conditionSections"
                :show-toolbar="false"
                :show-tabs="false"
                :show-eyebrow="false"
                headline=""
                :show-status-tag="false"
              />
            </div>

            <div :class="styles.progressCard">
              <div :class="styles.progressHeader">
                <span :class="styles.progressTitle">{{ ui('Collection Progress') }}</span>
                <span :class="styles.progressRuntime">
                  {{ ui('Running For') }} {{ elapsedTime }}
                </span>
              </div>
              <div :class="styles.progressBar">
                <EgProgress
                  :value="detailView.progress.percent"
                  :aria-label="ui('Collection Progress')"
                />
              </div>
              <span :class="styles.progressPercent">{{ detailView.progress.percent }}%</span>
              <div :class="styles.metricsGrid">
                <div :class="styles.metricBlock">
                  <span :class="styles.metricLabel">{{ ui('To Be Collected') }}</span>
                  <span :class="styles.metricValue">
                    {{ buildPaymentEngineCollectionDetailProgressMetric(
                      formatMetricCount(detailView.progress.pendingCount),
                      ui,
                    ) }}
                  </span>
                </div>
                <div :class="styles.metricBlock">
                  <span :class="styles.metricLabel">{{ ui('Failed') }}</span>
                  <span :class="[styles.metricValue, styles.metricValueFailed]">
                    {{ buildPaymentEngineCollectionDetailProgressMetric(
                      formatMetricCount(detailView.progress.failedCount),
                      ui,
                    ) }}
                  </span>
                </div>
                <div :class="styles.metricBlock">
                  <span :class="styles.metricLabel">{{ ui('Success') }}</span>
                  <span :class="styles.metricValue">
                    {{ buildPaymentEngineCollectionDetailProgressMetric(
                      formatMetricCount(detailView.progress.successCount),
                      ui,
                    ) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div :class="styles.recordsRegion">
            <EgDivider
              type="page"
              direction="horizontal"
              :class="styles.recordsDivider"
            />
            <div :class="styles.recordsTab">
              <EgTabs
                v-model="activeTab"
                :labels="recordTabLabels"
                horizontal-gap="xl"
                vertical-gap="xl"
              />
            </div>

            <div v-if="activeTab === 0" :class="styles.recordsTable">
              <PaymentEngineCollectionDetailRecordsTable
                :lines="displayRecordLines"
              />
            </div>

            <div v-if="activeTab === 0" :class="styles.recordsPaginer">
              <SigningBatchDataListPaginerBar
                :key="detail.id"
                :items="detailView.records"
                @paginated-change="displayRecordLines = $event"
              />
            </div>
          </div>
        </template>
      </EgDetail>
    </div>
  </div>
</template>

<style scoped>
:deep(.eds-detail > div:first-child) {
  display: none;
}
</style>
