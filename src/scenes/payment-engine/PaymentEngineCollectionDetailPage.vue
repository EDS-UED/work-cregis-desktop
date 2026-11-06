<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, withDefaults } from 'vue';
import {
  EgButton,
  EgDetail,
  EgFormSubmission,
  EgIcon,
  EgProgress,
  EgTabs,
  EgTag,
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
const headlineStatusLabel = computed(() => {
  if (detailView.value.stopped) return ui('Abnormally Stopped');
  return activeTabKind.value === 'gas-top-up' ? ui('Running') : ui('Collecting');
});
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

watch(
  activeRecordLines,
  (lines) => {
    displayRecordLines.value = lines.slice(0, 20);
  },
  { immediate: true },
);

watch(
  () => props.detail.id,
  () => {
    activeTab.value = 0;
  },
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
        :show-tabs="false"
        :sections="[]"
        :show-toolbar="false"
        :show-eyebrow="false"
        :show-status-tag="false"
        headline=""
      >
        <template #body>
          <div :class="styles.pageLayout">
            <section :class="styles.headlineGroup">
              <div :class="styles.headlineStack">
                <span class="typography-body-small-strong">
                  {{ ui(detailView.headline.eyebrowKey) }}
                </span>
                <div :class="styles.headlineAmountRow">
                  <h2 class="typography-headline">
                    {{ detailView.headline.amountText }}
                  </h2>
                  <EgTag
                    family="status"
                    :status="detailView.headline.status.kind"
                    size="lg"
                  >
                    {{ headlineStatusLabel }}
                  </EgTag>
                </div>
                <EgFormSubmission
                  v-if="headlineAlert"
                  :type="headlineAlert.type"
                  :text="headlineAlert.text"
                  :link-label="ui('Recharge')"
                />
                <div :class="styles.headlineMetaItems">
                  <span :class="styles.metaItem">
                    <EgIcon name="eds-wallet" size="sm" />
                    <span :class="styles.metaItemText">
                      {{ buildPaymentEngineCollectionDetailMinerFeeText(detailView, ui) }}
                    </span>
                  </span>
                  <span :class="styles.metaItem">
                    <EgIcon name="eds-user" size="sm" />
                    <span :class="styles.metaItemText">
                      {{ buildPaymentEngineCollectionDetailInitiatorText(detailView, ui) }}
                    </span>
                  </span>
                </div>
              </div>
              <EgButton
                v-if="!detailView.stopped"
                variant="solid"
                tone="danger"
                size="md"
              >
                {{ ui('Stop Collection') }}
              </EgButton>
            </section>

            <section :class="styles.cardsRow">
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
                <EgProgress
                  :value="detailView.progress.percent"
                  :aria-label="ui('Collection Progress')"
                />
                <div :class="styles.metricsGrid">
                  <div :class="styles.metricBlock">
                    <span :class="[styles.metricIcon, styles.metricIconPending]">
                      <EgIcon name="eds-time-wait-fill" fit />
                    </span>
                    <span :class="styles.metricLabel">{{ ui('To Be Collected') }}</span>
                    <span :class="styles.metricValue">
                      {{ buildPaymentEngineCollectionDetailProgressMetric(
                        formatMetricCount(detailView.progress.pendingCount),
                        ui,
                      ) }}
                    </span>
                  </div>
                  <div :class="styles.metricBlock">
                    <span :class="[styles.metricIcon, styles.metricIconFailed]">
                      <EgIcon name="eds-warning-fill" fit />
                    </span>
                    <span :class="styles.metricLabel">{{ ui('Failed') }}</span>
                    <span :class="[styles.metricValue, styles.metricValueFailed]">
                      {{ buildPaymentEngineCollectionDetailProgressMetric(
                        formatMetricCount(detailView.progress.failedCount),
                        ui,
                      ) }}
                    </span>
                  </div>
                  <div :class="styles.metricBlock">
                    <span :class="[styles.metricIcon, styles.metricIconSuccess]">
                      <EgIcon name="eds-enable-fill" fit />
                    </span>
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
            </section>

            <section :class="styles.recordsRegion">
              <EgTabs
                v-model="activeTab"
                :labels="recordTabLabels"
                horizontal-gap="xl"
                vertical-gap="xl"
              />
              <PaymentEngineCollectionDetailRecordsTable
                :lines="displayRecordLines"
                :table-kind="activeTabKind"
              />
              <div v-if="activeRecordLines.length > 20" :class="styles.recordsPaginer">
                <SigningBatchDataListPaginerBar
                  :key="`${detail.id}-${activeTabKind}`"
                  :items="activeRecordLines"
                  @paginated-change="displayRecordLines = $event"
                />
              </div>
            </section>
          </div>
        </template>
      </EgDetail>
    </div>
  </div>
</template>
