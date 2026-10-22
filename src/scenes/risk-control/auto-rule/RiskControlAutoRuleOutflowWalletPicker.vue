<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgComboFloatButton,
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
const draftIds = ref<Set<string>>(new Set());
const scrollRef = ref<HTMLElement | null>(null);
const optionListRef = ref<HTMLElement | null>(null);
const flotationRef = ref<{ close?: () => void } | null>(null);

const {
  canScroll: pickerCanScroll,
  topScrim: pickerTopScrim,
  bottomScrim: pickerBottomScrim,
  update: updatePickerScroll,
} = useScrollChromeScrim(scrollRef, { contentRef: optionListRef });

const triggerLabel = computed(() => {
  const ids = props.modelValue;
  if (!ids.length) return ui('Please Select');
  return ids.map((id) => outflowWalletLabelForId(id)).join(', ');
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

type SelectAllMode = 'none' | 'some' | 'all';

function isOptionDisabled(option: OutflowScopeOption): boolean {
  return props.isOptionDisabled?.(option.label) ?? false;
}

function isDraftSelected(id: string): boolean {
  return draftIds.value.has(id);
}

function selectableFilteredOptions(): OutflowScopeOption[] {
  return filteredOptions.value.filter((option) => !isOptionDisabled(option));
}

const selectAllMode = computed<SelectAllMode>(() => {
  const options = selectableFilteredOptions();
  if (!options.length) return 'none';

  let fullCount = 0;
  for (const option of options) {
    if (isDraftSelected(option.id)) fullCount += 1;
  }
  if (fullCount === options.length) return 'all';
  if (fullCount > 0) return 'some';
  return 'none';
});

const selectAllChecked = computed(() => selectAllMode.value === 'all');
const selectAllIndeterminate = computed(() => selectAllMode.value === 'some');

const hasDraftSelection = computed(() => draftIds.value.size > 0);

watch(
  () => [filteredOptions.value.length, searchQuery.value, showSearchEmpty.value],
  () => {
    updatePickerScroll();
  },
);

function cloneDraftFromModel() {
  draftIds.value = new Set(props.modelValue);
}

function resetSearch() {
  searchQuery.value = '';
}

function onPickerOpen() {
  cloneDraftFromModel();
  resetSearch();
  void nextTick(() => {
    updatePickerScroll();
  });
}

function onPickerClose() {
  resetSearch();
}

function onSelectAllToggle() {
  const next = new Set(draftIds.value);
  const shouldSelectAll = selectAllMode.value !== 'all';

  for (const option of filteredOptions.value) {
    if (isOptionDisabled(option)) continue;
    if (shouldSelectAll) next.add(option.id);
    else next.delete(option.id);
  }

  draftIds.value = next;
}

function setDraftChecked(id: string, checked: boolean) {
  const option = OUTFLOW_WALLET_OPTIONS.find((entry) => entry.id === id);
  if (!option) return;
  if (checked && isOptionDisabled(option)) return;

  const next = new Set(draftIds.value);
  if (checked) next.add(id);
  else next.delete(id);
  draftIds.value = next;
}

function onOptionClick(option: OutflowScopeOption) {
  if (isOptionDisabled(option)) return;
  setDraftChecked(option.id, !isDraftSelected(option.id));
}

function onPickerClear() {
  draftIds.value = new Set();
}

async function onPickerConfirm(close: () => void) {
  emit('update:modelValue', [...draftIds.value]);
  resetSearch();
  await nextTick();
  close();
  flotationRef.value?.close?.();
}

function onPickerCancel(close: () => void) {
  resetSearch();
  close();
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
                  key="select-all"
                  box-type="text"
                  :label="ui('All')"
                  show-checkbox
                  :checked="selectAllChecked"
                  :checkbox-indeterminate="selectAllIndeterminate"
                  :show-tag="false"
                  @click="onSelectAllToggle"
                  @update:checked="onSelectAllToggle"
                />

                <EgFlotationMenuItem
                  v-for="option in filteredOptions"
                  :key="option.id"
                  box-type="text"
                  :label="option.label"
                  :show-checkbox="true"
                  :checked="isDraftSelected(option.id)"
                  :disabled="isOptionDisabled(option)"
                  :show-tag="false"
                  @click="onOptionClick(option)"
                  @update:checked="setDraftChecked(option.id, $event)"
                />
              </div>
            </div>

            <EgComboFloatButton
              :class="styles.pickerAction"
              tone="decor"
              :count="2"
              :clear="hasDraftSelection"
              direction="right"
              bar-padding="compact"
              divider
              :cancel-label="ui('Cancel')"
              :confirm-label="ui('Confirm')"
              @clear="onPickerClear"
              @cancel="onPickerCancel(close)"
              @confirm="onPickerConfirm(close)"
            />
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
