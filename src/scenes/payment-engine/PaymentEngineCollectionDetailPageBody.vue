<script setup lang="ts">
import {
  EgButton,
  EgDetail,
  EgDivider,
  EgFormSubmission,
  EgGear,
  EgIcon,
  EgIconButton,
  EgMotionLayoutContent,
  EgProgress,
  EgTabs,
  EgTag,
  type EgFilterCondition,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useTabContentMotionSwitch } from '@/composables/useTabContentMotionSwitch';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import { applyDetailAmlSearchSectionOverlay } from '@/scenes/tasks/shared/applyDetailAmlSearchSectionOverlay';
import DetailAmlSearchToastHost from '@/scenes/tasks/shared/DetailAmlSearchToastHost.vue';
import { useDetailAmlSearchFlow } from '@/scenes/tasks/shared/useDetailAmlSearchFlow';
import WaasToolbarFilter from '@/scenes/waas-project/filter/WaasToolbarFilter.vue';
import {
  buildPaymentEngineCollectionDetailInitiatorText,
  buildPaymentEngineCollectionDetailMinerFeeText,
  buildPaymentEngineCollectionDetailProgressMetric,
} from './buildPaymentEngineCollectionDetailSections';
import { buildPaymentEngineCollectionDetailRecordFilterFields } from './paymentEngineCollectionDetailFilterFields';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import type { PaymentEngineCollectionDetailLineRecord } from './paymentEngineRecordConfigs';
import type {
  PaymentEngineCollectionDetailTabKind,
  PaymentEngineCollectionDetailView,
} from './paymentEngineCollectionDetailView';
import type { DetailSectionData } from '@eds/desktop-components';
import PaymentEngineCollectionDetailRecordsTable from './PaymentEngineCollectionDetailRecordsTable.vue';
import styles from './PaymentEngineCollectionDetailPage.module.css';

/** 展示用：60s 内 0%→100% — 1s 到 30%，再 50s 走 60% 至 90%，最后 9s 到 100% */
const COLLECTION_PROGRESS_TOTAL_MS = 60_000;
const COLLECTION_PROGRESS_PHASE1_MS = 1_000;
const COLLECTION_PROGRESS_PHASE2_MS = 50_000;
/** 阶段 2 结束时刻：1000 + 50000 = 51000 */
const COLLECTION_PROGRESS_PHASE2_END_MS = COLLECTION_PROGRESS_PHASE1_MS + COLLECTION_PROGRESS_PHASE2_MS;

const props = defineProps<{
  detailId: string;
  detailView: PaymentEngineCollectionDetailView;
  conditionSections: DetailSectionData[];
  headlineStatusLabel: string;
  headlineAlert: { type: 'notes' | 'danger'; text: string } | null;
  elapsedTime: string;
  recordTabLabels: string[];
  activeTabKind: PaymentEngineCollectionDetailTabKind;
  activeRecordLines: PaymentEngineCollectionDetailLineRecord[];
  displayRecordLines: PaymentEngineCollectionDetailLineRecord[];
  /** motion-page 内嵌：padding 由 configFormScrollContent 承担。 */
  inPageStack?: boolean;
}>();

const emit = defineEmits<{
  'update:displayRecordLines': [lines: PaymentEngineCollectionDetailLineRecord[]];
}>();

const activeTab = defineModel<number>('activeTab', { required: true });

const { ui } = useAppI18n();

const {
  amlSearchActiveItemKey,
  amlSearchResultsByKey,
  amlToastText,
  amlToastKeepMounted,
  amlToastMotionActive,
  onItemValueAmlSearchClick,
} = useDetailAmlSearchFlow({
  detailId: computed(() => props.detailId),
  ui,
});

const conditionSectionsWithAml = computed(() =>
  applyDetailAmlSearchSectionOverlay(props.conditionSections, {
    resultsByKey: amlSearchResultsByKey.value,
    translate: ui,
  }),
);

const recordFilterConditions = ref<EgFilterCondition[]>([]);
const recordFilterLogicMode = ref<EgFilterLogicMode>('all');
const recordFilterSetup = computed(() => buildPaymentEngineCollectionDetailRecordFilterFields(ui));

const recordsRegionRef = ref<HTMLElement | null>(null);
const recordsTableMotionRef = ref<HTMLElement | null>(null);

const {
  displayedTabIndex,
  contentExiting,
  contentEntering,
  bodyStyle: recordsTableMotionStyle,
  syncDisplayedTab,
} = useTabContentMotionSwitch(activeTab, {
  mode: 'sticky-anchor',
  anchorRef: recordsRegionRef,
  bodyRef: recordsTableMotionRef,
});

watch(() => props.detailId, syncDisplayedTab);

const displayedTabKind = computed(
  () =>
    props.detailView.recordTabs[displayedTabIndex.value]?.kind
    ?? props.detailView.recordTabs[0]?.kind
    ?? 'collection',
);

watch(
  () => [displayedTabKind.value, props.activeRecordLines] as const,
  ([, lines]) => {
    emit('update:displayRecordLines', [...lines]);
  },
  { immediate: true },
);

function formatMetricCount(value: string) {
  return formatGroupedNumber(Number.parseInt(value.replace(/,/g, ''), 10) || 0);
}

function clampPercent(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

const displayProgressPercent = ref(0);
let progressRafId: number | undefined;

function cancelProgressAnimation() {
  if (progressRafId !== undefined) {
    cancelAnimationFrame(progressRafId);
    progressRafId = undefined;
  }
}

/** elapsed ms → 进度 0–100（分段线性） */
function collectionProgressPercentAt(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= COLLECTION_PROGRESS_TOTAL_MS) return 100;
  if (elapsedMs <= COLLECTION_PROGRESS_PHASE1_MS) {
    return (elapsedMs / COLLECTION_PROGRESS_PHASE1_MS) * 30;
  }
  if (elapsedMs <= COLLECTION_PROGRESS_PHASE2_END_MS) {
    const inPhase2 = elapsedMs - COLLECTION_PROGRESS_PHASE1_MS;
    return 30 + (inPhase2 / COLLECTION_PROGRESS_PHASE2_MS) * 60;
  }
  const inPhase3 = elapsedMs - COLLECTION_PROGRESS_PHASE2_END_MS;
  const phase3Ms = COLLECTION_PROGRESS_TOTAL_MS - COLLECTION_PROGRESS_PHASE2_END_MS;
  return 90 + (inPhase3 / phase3Ms) * 10;
}

function startCollectionProgressAnimation() {
  cancelProgressAnimation();
  displayProgressPercent.value = 0;
  const startAt = performance.now();
  const tick = (now: number) => {
    const elapsed = now - startAt;
    if (elapsed >= COLLECTION_PROGRESS_TOTAL_MS) {
      displayProgressPercent.value = 100;
      progressRafId = undefined;
      return;
    }
    displayProgressPercent.value = collectionProgressPercentAt(elapsed);
    progressRafId = requestAnimationFrame(tick);
  };
  progressRafId = requestAnimationFrame(tick);
}

watch(
  () => [props.detailId, props.detailView.progress.percent, props.detailView.stopped] as const,
  ([, basePercent, stopped]) => {
    if (stopped) {
      cancelProgressAnimation();
      displayProgressPercent.value = clampPercent(basePercent);
      return;
    }
    startCollectionProgressAnimation();
  },
  { immediate: true },
);

onBeforeUnmount(cancelProgressAnimation);
</script>

<template>
  <div
    :class="[
      styles.pageLayout,
      props.inPageStack && styles.pageLayoutInPageStack,
    ]"
  >
    <section :class="styles.headlineGroup">
      <div :class="styles.headlineStack">
        <span :class="styles.headlineEyebrow">
          <span :class="styles.headlineEyebrowDot" aria-hidden="true" />
          <span class="typography-body-small-strong">
            {{ ui(props.detailView.headline.eyebrowKey) }}
          </span>
        </span>
        <div :class="styles.headlineMainRow">
          <div :class="styles.headlineAmountRow">
            <h2 :class="['typography-headline', styles.headlineAmount]">
              {{ props.detailView.headline.amountText }}
            </h2>
            <div
              v-if="props.detailView.headline.status.kind === 'success'"
              :class="styles.headlineCollectingStatus"
            >
              <EgGear :class="styles.headlineCollectingGear" :active="true" />
              <span
                :class="[
                  'typography-body-small-strong',
                  styles.headlineCollectingStatusLabel,
                ]"
              >
                {{ props.headlineStatusLabel }}
              </span>
            </div>
            <EgTag
              v-else
              family="status"
              :status="props.detailView.headline.status.kind"
              size="lg"
            >
              {{ props.headlineStatusLabel }}
            </EgTag>
          </div>
          <EgButton
            v-if="!props.detailView.stopped"
            variant="solid"
            tone="danger"
            size="md"
          >
            {{ ui('Stop Collection') }}
          </EgButton>
        </div>
        <div v-if="props.headlineAlert" :class="styles.headlineAlertWrap">
          <EgFormSubmission
            :type="props.headlineAlert.type"
            :text="props.headlineAlert.text"
            :link-label="ui('Recharge')"
          />
        </div>
        <div :class="styles.headlineMetaItems">
          <span :class="styles.metaItem">
            <EgIcon name="eds-gas-fee" size="sm" fit :class="styles.metaItemIcon" />
            <span :class="styles.metaItemText">
              {{ buildPaymentEngineCollectionDetailMinerFeeText(props.detailView, ui) }}
            </span>
          </span>
          <EgDivider
            type="navigator"
            direction="vertical"
            :class="styles.metaDivider"
          />
          <span :class="styles.metaItem">
            <EgIcon
              name="eds-user-mobiletabbar"
              size="sm"
              fit
              :class="styles.metaItemIcon"
            />
            <span :class="styles.metaItemText">
              {{ buildPaymentEngineCollectionDetailInitiatorText(props.detailView, ui) }}
            </span>
          </span>
        </div>
      </div>
    </section>

    <section :class="styles.cardsRow">
      <div :class="styles.conditionCard">
        <EgDetail
          :sections="conditionSectionsWithAml"
          :show-toolbar="false"
          :show-tabs="false"
          :show-eyebrow="false"
          headline=""
          :show-status-tag="false"
          :value-copy-label="ui('Copy')"
          :value-aml-search-label="ui('AML Search')"
          :aml-search-active-item-key="amlSearchActiveItemKey"
          @item-value-aml-search-click="onItemValueAmlSearchClick"
        />
      </div>

      <div :class="styles.progressCard">
        <div :class="styles.progressHeader">
          <span :class="styles.cardSectionTitle">{{ ui('Collection Progress') }}</span>
          <span :class="styles.progressRuntime">
            <span :class="styles.progressRuntimeLabel">{{ ui('Running For') }}</span>
            <span :class="styles.progressRuntimeDuration">{{ props.elapsedTime }}</span>
          </span>
        </div>
        <div :class="styles.progressTrackShell">
          <EgProgress
            :value="displayProgressPercent"
            :aria-label="ui('Collection Progress')"
          />
        </div>
        <div :class="styles.metricsGrid">
          <div :class="styles.metricBlock">
            <span :class="[styles.metricIcon, styles.metricIconPending]">
              <EgIcon name="eds-clocks-fill" fit fill-tone="primary" />
            </span>
            <span :class="styles.metricLabel">{{ ui('To Be Collected') }}</span>
            <span :class="styles.metricValue">
              {{ buildPaymentEngineCollectionDetailProgressMetric(
                formatMetricCount(props.detailView.progress.pendingCount),
                ui,
              ) }}
            </span>
          </div>
          <div :class="styles.metricBlock">
            <span :class="[styles.metricIcon, styles.metricIconFailed]">
              <EgIcon name="eds-warning-fill" fit fill-tone="primary" />
            </span>
            <span :class="styles.metricLabel">{{ ui('Failed') }}</span>
            <span :class="[styles.metricValue, styles.metricValueFailed]">
              {{ buildPaymentEngineCollectionDetailProgressMetric(
                formatMetricCount(props.detailView.progress.failedCount),
                ui,
              ) }}
            </span>
          </div>
          <div :class="styles.metricBlock">
            <span :class="[styles.metricIcon, styles.metricIconSuccess]">
              <EgIcon name="eds-enable-fill" fit fill-tone="primary" />
            </span>
            <span :class="styles.metricLabel">{{ ui('Success') }}</span>
            <span :class="styles.metricValue">
              {{ buildPaymentEngineCollectionDetailProgressMetric(
                formatMetricCount(props.detailView.progress.successCount),
                ui,
              ) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section ref="recordsRegionRef" :class="styles.recordsRegion">
      <div :class="styles.recordsStickyBar">
        <div :class="styles.recordsTabsBar">
          <EgTabs
            v-model="activeTab"
            :labels="props.recordTabLabels"
            horizontal-gap="xl"
            vertical-gap="xl"
          />
          <WaasToolbarFilter
            v-model="recordFilterConditions"
            v-model:logic-mode="recordFilterLogicMode"
            :fields="recordFilterSetup.fields"
            :operators="recordFilterSetup.operators"
          >
            <template #trigger="{ active, onClick }">
              <EgIconButton
                size="sm"
                :label="ui('筛选')"
                :aria-expanded="active"
                @click.stop="onClick"
              >
                <EgIcon name="eds-filter" fit />
              </EgIconButton>
            </template>
          </WaasToolbarFilter>
        </div>
        <EgDivider type="page" direction="horizontal" />
      </div>

      <div
        ref="recordsTableMotionRef"
        :class="styles.recordsTableMotion"
        :style="recordsTableMotionStyle"
      >
        <EgMotionLayoutContent
          :content-exiting="contentExiting"
          :content-entering="contentEntering"
        >
          <PaymentEngineCollectionDetailRecordsTable
            :key="`${props.detailId}-${displayedTabKind}`"
            :lines="props.displayRecordLines"
            :table-kind="props.activeTabKind"
          />
        </EgMotionLayoutContent>
      </div>

      <div
        v-if="!props.inPageStack && props.activeRecordLines.length > 0"
        :class="styles.recordsPaginer"
      >
        <SigningBatchDataListPaginerBar
          :key="`${props.detailId}-${props.activeTabKind}`"
          :items="props.activeRecordLines"
          @paginated-change="emit('update:displayRecordLines', $event)"
        />
      </div>
    </section>

    <DetailAmlSearchToastHost
      :keep-mounted="amlToastKeepMounted"
      :motion-active="amlToastMotionActive"
      :text="amlToastText"
    />
  </div>
</template>
