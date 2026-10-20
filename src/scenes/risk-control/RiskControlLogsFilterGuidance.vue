<script setup lang="ts">
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import {
  EgAnchoredPopover,
  EgFilter,
  EgGuidancePopoverPanel,
  EgIcon,
  EgIconButton,
  EgMessage,
  createFilterTranslate,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  hasSeenRiskControlLogsFilterGuide,
  markRiskControlLogsFilterGuideSeen,
  riskControlLogsFilterGuideReplayNonce,
} from './riskControlLogsFilterGuideStorage';
import styles from './RiskControlLogsFilterGuidance.module.css';

/** 256px 引导宽 + align end 箭头几何，使尖端落在 32px iconSlot 水平中心（≈2×spacing-2）。 */
const FILTER_GUIDE_CROSS_AXIS_OFFSET_PX = 16;

const props = withDefaults(
  defineProps<{
    fields: EgFilterField[];
    operators: EgFilterOperator[];
    disabled?: boolean;
    active?: boolean;
  }>(),
  {
    disabled: false,
    active: true,
  },
);

const conditions = defineModel<EgFilterCondition[]>({ default: () => [] });
const logicMode = defineModel<EgFilterLogicMode>('logicMode', { default: 'all' });

const { locale, ui } = useAppI18n();
const filterTranslate = computed(() => {
  const filterUi = createFilterTranslate(locale.value);
  return (text: string) => {
    const appText = ui(text);
    if (appText !== text) return appText;
    return filterUi(text);
  };
});

const filterTriggerLabel = computed(() => filterTranslate.value('筛选'));

const guideRef = ref<{ close?: () => void; open?: () => void } | null>(null);
const guideOpen = ref(false);

let openTimer: ReturnType<typeof setTimeout> | undefined;

function clearOpenTimer() {
  if (openTimer !== undefined) {
    clearTimeout(openTimer);
    openTimer = undefined;
  }
}

function onGuideOpen() {
  guideOpen.value = true;
}

function onGuideDismiss() {
  guideOpen.value = false;
  markRiskControlLogsFilterGuideSeen();
}

function dismissGuide() {
  guideRef.value?.close?.();
  onGuideDismiss();
}

function shouldAutoPresentGuide(): boolean {
  return !hasSeenRiskControlLogsFilterGuide();
}

function scheduleGuideOpen() {
  clearOpenTimer();
  if (!props.active || props.disabled) return;
  if (!shouldAutoPresentGuide()) return;

  openTimer = setTimeout(async () => {
    await nextTick();
    if (!props.active || props.disabled) return;
    if (!shouldAutoPresentGuide()) return;
    closeAllAnchoredTooltips();
    guideRef.value?.open?.();
  }, 320);
}

watch(
  () => props.active,
  (active) => {
    if (active) {
      scheduleGuideOpen();
      return;
    }
    clearOpenTimer();
    guideOpen.value = false;
    guideRef.value?.close?.();
  },
  { immediate: true },
);

watch(riskControlLogsFilterGuideReplayNonce, () => {
  if (!props.active) return;
  scheduleGuideOpen();
});

onBeforeUnmount(() => {
  clearOpenTimer();
});
</script>

<template>
  <EgAnchoredPopover
    ref="guideRef"
    height-mode="adaptive"
    width-mode="fixed"
    :width="256"
    :top-tool-title="ui('Risk control logs filter guide title')"
    top-tool
    top-tool-closable
    placement="bottom"
    align="end"
    :cross-axis-offset="FILTER_GUIDE_CROSS_AXIS_OFFSET_PX"
    boundary-selector=".app-preview"
    teleport-to=".app-preview"
    :disabled="disabled"
    @open="onGuideOpen"
    @dismiss="onGuideDismiss"
  >
    <template #trigger>
      <span :class="styles.guideTriggerHost">
        <EgFilter
          v-model="conditions"
          v-model:logic-mode="logicMode"
          :fields="fields"
          :operators="operators"
          :translate="filterTranslate"
          add-label="添加条件"
          :max-conditions="20"
          placement="bottom"
          align="start"
          value-align="end"
          boundary-selector=".app-preview"
          teleport-to=".app-preview"
          :disabled="disabled"
        >
          <template #trigger="{ active, count, onClick }">
            <span
              :class="[
                styles.filterTriggerRoot,
                disabled && styles.filterTriggerDisabled,
                active && styles.filterTriggerExpanded,
              ]"
              @click.stop="onClick"
            >
              <span
                data-eds-trigger-metrics
                :class="[
                  styles.filterIconMetrics,
                  guideOpen && styles.filterIconMetricsGuideActive,
                ]"
              >
                <EgIconButton
                  as="span"
                  shape="rectangular"
                  size="sm"
                  :label="filterTriggerLabel"
                  :disabled="disabled"
                >
                  <EgIcon name="eds-filter" size="sm" />
                </EgIconButton>
                <span v-if="count > 0" :class="styles.filterBadge" aria-hidden="true">
                  <EgMessage type="brand" :text="String(count)" />
                </span>
              </span>
              <span :class="styles.filterLabelWrap">
                <span :class="styles.filterLabelPaint" aria-hidden="true">
                  {{ filterTriggerLabel }}
                </span>
                <span :class="styles.filterLabelSizer">
                  {{ filterTriggerLabel }}
                </span>
              </span>
            </span>
          </template>
        </EgFilter>
      </span>
    </template>
    <template #default>
      <EgGuidancePopoverPanel
        :body="ui('Risk control logs filter guide body')"
        :action-label="ui('Got it')"
        @action="dismissGuide"
      />
    </template>
  </EgAnchoredPopover>
</template>
