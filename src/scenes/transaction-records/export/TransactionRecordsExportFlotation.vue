<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  EgButton,
  EgDatePickerTooltip,
  EgDivider,
  EgIcon,
  EgIconButton,
  EgIconProButton,
  EgRadio,
  EgStatusTag,
  EgTooltip,
  EgTooltipPanel,
  createFilterTranslate,
  provideFilterTranslate,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  formatExportDateRangeValue,
  formatExportHistoryTimestamp,
  formatExportHistoryTitle,
  parseExportDateRangeValue,
  resolveDefaultExportDateRange,
  resolveExportPresetRange,
  TRANSACTION_RECORDS_EXPORT_HISTORY_DEMO,
  TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_IDS,
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS,
  type TransactionRecordsExportHistoryItem,
  type TransactionRecordsExportPresetId,
  type TransactionRecordsExportQuickPresetId,
  type TransactionRecordsExportScope,
} from './transactionRecordsExportData';
import styles from './TransactionRecordsExportFlotation.module.css';

const EXPORT_HISTORY_LOADING_MS = 1200;
const PANEL_MAX_HEIGHT_CAP = 560;
const PANEL_MIN_HEIGHT = 280;
const PANEL_EDGE_GAP = 12;

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    hasActiveFilters?: boolean;
    /** When true, Export click does not open the panel (emit `open-blocked` instead). */
    blockOpen?: boolean;
    /** Radio group name; unique when more than one export panel is mounted. */
    scopeGroupName?: string;
    /** Hide Export according to filter / Export all radios (monthly statement). */
    showScope?: boolean;
    /** Hide Last 3/6/12 months presets and the date-range picker. */
    showDateRange?: boolean;
    initialHistory?: readonly TransactionRecordsExportHistoryItem[];
    resolveHistoryEntry?: () => { title: string; subtitle?: string };
    /** Panel heading; defaults to Export (monthly statement uses Generate Monthly Statement). */
    panelTitle?: string;
  }>(),
  {
    disabled: false,
    hasActiveFilters: false,
    blockOpen: false,
    scopeGroupName: 'tx-records-export-scope',
    showScope: true,
    showDateRange: true,
    panelTitle: '',
  },
);

const emit = defineEmits<{
  export: [payload: {
    scope: TransactionRecordsExportScope;
    dateRange: string;
    presetId: TransactionRecordsExportPresetId;
  }];
  'open-blocked': [];
}>();

const { locale, ui } = useAppI18n();

const panelHeading = computed(() => props.panelTitle.trim() || ui('Export'));

const expanded = ref(false);
const rootRef = ref<HTMLElement | null>(null);
const anchorRef = ref<{ openPanel?: () => void; close?: () => void } | null>(null);
const panelMaxHeight = ref(PANEL_MAX_HEIGHT_CAP);
const presetId = ref<TransactionRecordsExportPresetId>('custom');
const defaultRange = resolveDefaultExportDateRange();
const dateRange = ref(formatExportDateRangeValue(defaultRange.start, defaultRange.end));
const exportScope = ref<TransactionRecordsExportScope>(
  props.hasActiveFilters ? 'filtered' : 'all',
);
const liveHistoryItems = ref<TransactionRecordsExportHistoryItem[]>([]);
const historyItems = computed(() => [
  ...liveHistoryItems.value,
  ...(props.initialHistory ?? TRANSACTION_RECORDS_EXPORT_HISTORY_DEMO).map((item) => ({
    ...item,
  })),
]);
let historyReadyTimer: ReturnType<typeof setTimeout> | null = null;
let historySeq = 0;

const filterTranslate = computed(() => createFilterTranslate(locale.value));
provideFilterTranslate((text) => filterTranslate.value(text));

const quickPresetItems = computed(() =>
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_IDS.map((id) => ({
    id,
    label: ui(TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS[id]),
  })),
);

const parsedDateRange = computed(() => parseExportDateRangeValue(dateRange.value));
const startDateLabel = computed(
  () => parsedDateRange.value.start || filterTranslate.value('请选择'),
);
const endDateLabel = computed(
  () => parsedDateRange.value.end || filterTranslate.value('请选择'),
);

const isExportHistoryLoading = computed(() =>
  historyItems.value.some((item) => item.status === 'loading'),
);

function clearHistoryReadyTimer() {
  if (historyReadyTimer == null) return;
  clearTimeout(historyReadyTimer);
  historyReadyTimer = null;
}

function onOpen() {
  expanded.value = true;
  exportScope.value = props.hasActiveFilters ? 'filtered' : 'all';
}

function onClose() {
  expanded.value = false;
}

function closePanel() {
  anchorRef.value?.close?.();
}

function resolvePanelMaxHeight() {
  const trigger =
    rootRef.value?.querySelector<HTMLElement>('[data-eds-trigger-metrics], button')
    ?? rootRef.value;
  const preview = document.querySelector('.app-preview');
  if (!(trigger instanceof HTMLElement) || !(preview instanceof HTMLElement)) {
    return PANEL_MAX_HEIGHT_CAP;
  }
  const remaining =
    preview.getBoundingClientRect().bottom
    - trigger.getBoundingClientRect().bottom
    - PANEL_EDGE_GAP;
  return Math.min(PANEL_MAX_HEIGHT_CAP, Math.max(PANEL_MIN_HEIGHT, Math.floor(remaining)));
}

function onTriggerClick() {
  if (props.disabled) return;
  if (props.blockOpen) {
    if (expanded.value) closePanel();
    emit('open-blocked');
    return;
  }
  if (expanded.value) {
    closePanel();
    return;
  }
  panelMaxHeight.value = resolvePanelMaxHeight();
  anchorRef.value?.openPanel?.();
}

function selectPreset(id: TransactionRecordsExportQuickPresetId) {
  presetId.value = id;
  const range = resolveExportPresetRange(id);
  dateRange.value = formatExportDateRangeValue(range.start, range.end);
}

function onDateRangeUpdate(value: string) {
  dateRange.value = value;
  presetId.value = 'custom';
}

function selectScope(scope: TransactionRecordsExportScope) {
  exportScope.value = scope;
}

function onExportClick() {
  if (isExportHistoryLoading.value) return;

  emit('export', {
    scope: exportScope.value,
    dateRange: dateRange.value,
    presetId: presetId.value,
  });

  historySeq += 1;
  const pendingId = `exp-live-${historySeq}`;
  const resolved = props.resolveHistoryEntry?.();
  const { start, end } = parseExportDateRangeValue(dateRange.value);
  const pendingItem: TransactionRecordsExportHistoryItem = {
    id: pendingId,
    title: resolved?.title ?? formatExportHistoryTitle(start, end),
    subtitle: resolved?.subtitle,
    operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
    exportedAt: formatExportHistoryTimestamp(),
    status: 'loading',
  };
  liveHistoryItems.value = [pendingItem, ...liveHistoryItems.value];

  clearHistoryReadyTimer();
  historyReadyTimer = setTimeout(() => {
    historyReadyTimer = null;
    liveHistoryItems.value = liveHistoryItems.value.map((item) =>
      item.id === pendingId
        ? {
            ...item,
            status: 'ready',
          }
        : item,
    );
  }, EXPORT_HISTORY_LOADING_MS);
}

function onHistoryDownload(_id: string) {
  // Demo: history download is visual-only for now.
}

onBeforeUnmount(() => {
  clearHistoryReadyTimer();
});
</script>

<template>
  <span ref="rootRef" :class="styles.root">
    <EgTooltip
      ref="anchorRef"
      trigger="click"
      :click-toggle="false"
      placement="bottom"
      align="end"
      :wrap-tooltip="false"
      :disabled="disabled"
      teleport-to=".app-preview"
      boundary-selector=".app-preview"
      @open="onOpen"
      @close="onClose"
    >
      <span data-eds-trigger-metrics :class="styles.triggerMetrics">
        <slot
          name="trigger"
          :expanded="expanded"
          :disabled="disabled"
          :on-click="onTriggerClick"
        >
          <EgIconProButton
            :label="ui('Export')"
            :active="expanded"
            :disabled="disabled"
            :aria-expanded="expanded"
            @click.stop="onTriggerClick"
          >
            <EgIcon name="eds-arrow-download" size="sm" />
          </EgIconProButton>
        </slot>
      </span>

      <template #content>
        <EgTooltipPanel
          panel-kind="flotation"
          panel-micro-float
          panel-flush
          width-mode="fixed"
          :width="380"
          height-mode="adaptive"
          :max-height="panelMaxHeight"
          :scrollable="true"
        >
          <div :class="styles.panel" data-export-flotation-panel>
            <div :class="styles.headerRow">
              <span :class="styles.title">{{ panelHeading }}</span>
              <div
                v-if="showDateRange"
                :class="styles.presets"
                role="tablist"
              >
                <button
                  v-for="item in quickPresetItems"
                  :key="item.id"
                  type="button"
                  role="tab"
                  :class="[
                    styles.presetButton,
                    presetId === item.id && styles.presetButtonActive,
                  ]"
                  :aria-selected="presetId === item.id"
                  @click="selectPreset(item.id)"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div v-if="showDateRange" :class="styles.rangeBlock">
              <div :class="styles.rangeShell">
                <div :class="styles.rangeVisual" aria-hidden="true">
                  <div :class="styles.rangeField">
                    <span :class="styles.rangeFieldIcon">
                      <EgIcon name="eds-calendar" size="sm" />
                    </span>
                    <span :class="styles.rangeFieldText">{{ startDateLabel }}</span>
                  </div>
                  <span :class="styles.rangeTo">{{ filterTranslate('至') }}</span>
                  <div :class="styles.rangeField">
                    <span :class="styles.rangeFieldIcon">
                      <EgIcon name="eds-calendar" size="sm" />
                    </span>
                    <span :class="styles.rangeFieldText">{{ endDateLabel }}</span>
                  </div>
                </div>
                <div :class="styles.rangePickerOverlay">
                  <EgDatePickerTooltip
                    :model-value="dateRange"
                    mode="range"
                    trigger-width-mode="fixed"
                    :trigger-width="332"
                    :placeholder="filterTranslate('开始 - 结束')"
                    boundary-selector=".app-preview"
                    picker-align="start"
                    @update:model-value="onDateRangeUpdate"
                  />
                </div>
              </div>
              <div :class="styles.hintRow">
                <EgIcon
                  :class="styles.hintIcon"
                  name="eds-information-fill"
                  fit
                />
                <span>{{ ui('The export date range cannot exceed 12 months') }}</span>
              </div>
            </div>

            <slot name="extra-fields" />

            <div
              v-if="showScope"
              :class="styles.scopeGroup"
              role="radiogroup"
              :aria-label="ui('Export scope')"
            >
              <button
                type="button"
                :class="styles.scopeOption"
                role="radio"
                :aria-checked="exportScope === 'filtered'"
                @click="selectScope('filtered')"
              >
                <EgRadio
                  :model-value="exportScope === 'filtered'"
                  :name="scopeGroupName"
                  value="filtered"
                  tabindex="-1"
                  aria-hidden="true"
                  @update:model-value="selectScope('filtered')"
                />
                <span>{{ ui('Export according to filter options') }}</span>
              </button>
              <button
                type="button"
                :class="styles.scopeOption"
                role="radio"
                :aria-checked="exportScope === 'all'"
                @click="selectScope('all')"
              >
                <EgRadio
                  :model-value="exportScope === 'all'"
                  :name="scopeGroupName"
                  value="all"
                  tabindex="-1"
                  aria-hidden="true"
                  @update:model-value="selectScope('all')"
                />
                <span>{{ ui('Export all') }}</span>
              </button>
            </div>

            <div :class="styles.actions">
              <EgButton
                tone="decor"
                variant="solid"
                size="md"
                type="button"
                :loading="isExportHistoryLoading"
                :disabled="isExportHistoryLoading"
                @click="onExportClick"
              >
                {{ ui('Export') }}
              </EgButton>
            </div>

            <EgDivider type="module" direction="horizontal" />

            <div :class="styles.history">
              <div :class="styles.historyTitle">{{ ui('Export History') }}</div>
              <div :class="styles.historyList">
                <div
                  v-for="item in historyItems"
                  :key="item.id"
                  :class="styles.historyItem"
                >
                  <div :class="styles.historyMeta">
                    <div :class="styles.historyName">{{ item.title }}</div>
                    <span v-if="item.subtitle" :class="styles.historySubtitle">
                      {{ item.subtitle }}
                    </span>
                    <span :class="styles.historySubItem">
                      <EgIcon name="eds-personal" fit />
                      {{ item.operator }}
                    </span>
                    <span :class="styles.historySubItem">
                      <EgIcon name="eds-clocks" fit />
                      {{ item.exportedAt }}
                    </span>
                  </div>
                  <EgStatusTag
                    v-if="item.status === 'loading'"
                    :class="styles.historyProcessingTag"
                    status="success"
                    size="sm"
                    truncate
                  >
                    {{ ui('Processing') }}
                  </EgStatusTag>
                  <EgIconButton
                    v-else
                    :class="styles.historyDownload"
                    size="sm"
                    :label="ui('Download')"
                    @click="onHistoryDownload(item.id)"
                  >
                    <EgIcon name="eds-arrow-download" fit />
                  </EgIconButton>
                </div>
              </div>
            </div>
          </div>
        </EgTooltipPanel>
      </template>
    </EgTooltip>
  </span>
</template>
