<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgSearchInput,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import {
  OUTFLOW_WALLET_OPTIONS,
  outflowWalletLabelForId,
  type OutflowScopeOption,
} from './riskControlAutoRuleOutflowScopeOptions';
import styles from './RiskControlAutoRuleOutflowWalletPicker.module.css';

const MENU_MAX_HEIGHT = 310;

const props = defineProps<{
  modelValue: readonly string[];
  isOptionDisabled?: (label: string) => boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const { ui } = useAppI18n();

const searchQuery = ref('');
const scrollRef = ref<HTMLElement | null>(null);
const optionListRef = ref<HTMLElement | null>(null);
const flotationRef = ref<{ close?: () => void } | null>(null);

const {
  canScroll: pickerCanScroll,
  topScrim: pickerTopScrim,
  bottomScrim: pickerBottomScrim,
  update: updatePickerScroll,
} = useScrollChromeScrim(scrollRef, { contentRef: optionListRef });

const selectedWalletId = computed(() => props.modelValue[0] ?? '');

const triggerLabel = computed(() => {
  if (!selectedWalletId.value) return ui('Please Select');
  return outflowWalletLabelForId(selectedWalletId.value);
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return OUTFLOW_WALLET_OPTIONS;
  return OUTFLOW_WALLET_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

const showSearchEmpty = computed(
  () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
);

function isOptionDisabled(option: OutflowScopeOption): boolean {
  return props.isOptionDisabled?.(option.label) ?? false;
}

watch(
  () => [filteredOptions.value.length, searchQuery.value, showSearchEmpty.value],
  () => {
    updatePickerScroll();
  },
);

function resetSearch() {
  searchQuery.value = '';
}

function onPickerOpen() {
  resetSearch();
  void nextTick(() => {
    updatePickerScroll();
  });
}

function onPickerClose() {
  resetSearch();
}

function onOptionClick(option: OutflowScopeOption, close: () => void) {
  if (isOptionDisabled(option)) return;
  emit('update:modelValue', [option.id]);
  resetSearch();
  void nextTick(() => {
    close();
    flotationRef.value?.close?.();
  });
}
</script>

<template>
  <div :class="styles.root">
    <EgFlotation
      ref="flotationRef"
      placement="bottom"
      align="start"
      width-mode="trigger"
      :show-add="false"
      :show-menu-divider="false"
      close-on-scroll
      @open="onPickerOpen"
      @close="onPickerClose"
    >
      <template #trigger="{ expanded }">
        <EgFlotationTrigger
          trigger-style="subtle"
          size="md"
          width-mode="adaptive"
          :label="triggerLabel"
          :expanded="expanded"
        />
      </template>

      <template #content="{ close, menuWidth, menuWidthMode }">
        <EgFlotationMenu
          :class="styles.menu"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          height-mode="adaptive"
          :max-height="MENU_MAX_HEIGHT"
          :show-add="false"
          :show-divider="false"
          :scrollable="false"
        >
          <div :class="styles.pickerRows">
            <div :class="styles.searchHeader">
              <EgSearchInput
                v-model="searchQuery"
                :placeholder="ui('Search')"
                width-mode="full"
              />
            </div>

            <EgDivider
              v-if="pickerCanScroll"
              type="module"
              direction="horizontal"
              :class="[
                comboActionStyles.divider,
                comboActionStyles.dividerAnimated,
                !pickerTopScrim && comboActionStyles.dividerAnimatedHidden,
                styles.headerDivider,
              ]"
              :hide="!pickerTopScrim"
            />

            <div
              ref="scrollRef"
              :class="[
                styles.optionListScroll,
                showSearchEmpty && styles.optionListScrollEmpty,
                pickerBottomScrim && !showSearchEmpty && styles.listScrollFadeBottom,
              ]"
            >
              <div v-if="showSearchEmpty" :class="styles.searchEmpty">
                <EgIcon :class="styles.searchEmptyIcon" name="eds-business-7" fit />
                <span :class="['typography-body-small', styles.searchEmptyText]">
                  {{ ui('No data') }}
                </span>
              </div>
              <div v-else ref="optionListRef" :class="styles.optionList">
                <EgFlotationMenuItem
                  v-for="option in filteredOptions"
                  :key="option.id"
                  box-type="text"
                  :label="option.label"
                  :show-tag="false"
                  :disabled="isOptionDisabled(option)"
                  :focused="selectedWalletId === option.id"
                  @click="onOptionClick(option, close)"
                />
              </div>
            </div>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
