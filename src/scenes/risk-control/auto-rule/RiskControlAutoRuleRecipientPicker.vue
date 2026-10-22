<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  closeAllAnchoredTooltips,
  EgAvatar,
  EgComboFloatButton,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgIconButton,
  EgSearchInput,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import {
  AUTO_RULE_FILTER_PICKER_MAX_HEIGHT,
  AUTO_RULE_FILTER_PICKER_MENU_WIDTH,
} from './riskControlAutoRuleFilterPickerConstants';
import {
  autoRuleTeamMemberById,
  autoRuleTeamMemberFilterOptions,
} from './riskControlAutoRuleMemberOptions';
import sharedEntryStyles from './riskControlAutoRuleEntryAddField.shared.module.css';
import styles from './RiskControlAutoRuleRecipientPicker.module.css';

const FILTER_MEMBER_SELECT_ALL_ICON = 'eds-list-lattice-mobile-fill';

const props = withDefaults(
  defineProps<{
    modelValue: readonly string[];
    showTitle?: boolean;
  }>(),
  {
    showTitle: true,
  },
);

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

const selectedMembers = computed(() =>
  props.modelValue
    .map((id) => autoRuleTeamMemberById(id))
    .filter((member): member is NonNullable<typeof member> => Boolean(member)),
);

const memberOptions = computed(() => autoRuleTeamMemberFilterOptions());

function isMemberRowDisabled(id: string): boolean {
  return props.modelValue.includes(id);
}

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return memberOptions.value;
  return memberOptions.value.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

const showSearchEmpty = computed(
  () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
);

type SelectAllMode = 'none' | 'some' | 'all';

function isDraftSelected(id: string): boolean {
  return draftIds.value.has(id);
}

const selectAllMode = computed<SelectAllMode>(() => {
  const options = filteredOptions.value.filter((option) => !isMemberRowDisabled(option.id));
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

function removeMember(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((entry) => entry !== id),
  );
}

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

function onAddTriggerPointerDown() {
  closeAllAnchoredTooltips();
}

function onSelectAllToggle() {
  const next = new Set(draftIds.value);
  const shouldSelectAll = selectAllMode.value !== 'all';

  for (const option of filteredOptions.value) {
    if (isMemberRowDisabled(option.id)) continue;
    if (shouldSelectAll) next.add(option.id);
    else next.delete(option.id);
  }

  draftIds.value = next;
}

function setDraftChecked(id: string, checked: boolean) {
  if (isMemberRowDisabled(id)) return;
  const next = new Set(draftIds.value);
  if (checked) next.add(id);
  else next.delete(id);
  draftIds.value = next;
}

function onOptionClick(id: string) {
  if (isMemberRowDisabled(id)) return;
  setDraftChecked(id, !isDraftSelected(id));
}

function onPickerClear() {
  draftIds.value = new Set(props.modelValue);
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
  <div :class="styles.field">
    <span v-if="showTitle" :class="styles.fieldTitle">{{
      ui('Auto rule recipient field label')
    }}</span>

    <div v-if="selectedMembers.length" :class="styles.entryList">
      <div
        v-for="member in selectedMembers"
        :key="member.id"
        :class="styles.entryRow"
      >
        <div :class="styles.entryMeta">
          <EgAvatar size="xl" :name="member.avatarName" :color-seed="member.id" />
          <div :class="styles.entryCopy">
            <span :class="styles.entryName">{{ member.name }}</span>
            <span :class="styles.entryEmail">{{ member.emailMasked }}</span>
          </div>
        </div>
        <EgIconButton
          :class="[styles.entryDeleteButton, sharedEntryStyles.entryDeleteButton]"
          shape="rectangular"
          size="sm"
          :label="ui('Delete')"
          @click="removeMember(member.id)"
        >
          <EgIcon
            :class="sharedEntryStyles.entryDeleteIcon"
            name="eds-recycle"
            size="sm"
          />
        </EgIconButton>
      </div>
    </div>

    <div :class="styles.addRow">
      <EgFlotation
        ref="flotationRef"
        placement="bottom"
        align="start"
        width-mode="fixed"
        :width="AUTO_RULE_FILTER_PICKER_MENU_WIDTH"
        height-mode="adaptive"
        :max-height="AUTO_RULE_FILTER_PICKER_MAX_HEIGHT"
        :show-add="false"
        :show-menu-divider="false"
        boundary-selector=".app-preview"
        flip
        :close-on-scroll="false"
        @open="onPickerOpen"
        @close="onPickerClose"
      >
        <template #trigger="{ expanded }">
          <EgIconButton
            data-eds-trigger-metrics
            shape="rectangular"
            outline-style="bordered"
            size="lg"
            :label="ui('Add')"
            :class="[styles.addIconTriggerHost, expanded && styles.addIconTriggerExpanded]"
            :aria-expanded="expanded"
            @pointerdown.capture="onAddTriggerPointerDown"
          >
            <EgIcon name="eds-add-medium" fit />
          </EgIconButton>
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
            :max-height="AUTO_RULE_FILTER_PICKER_MAX_HEIGHT"
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
                    box-type="image-text"
                    :label="ui('All')"
                    show-checkbox
                    :checked="selectAllChecked"
                    :checkbox-indeterminate="selectAllIndeterminate"
                    :show-tag="false"
                    @click="onSelectAllToggle"
                    @update:checked="onSelectAllToggle"
                  >
                    <template #leading>
                      <span :class="styles.selectAllIcon">
                        <span :class="styles.selectAllIconGlyph">
                          <EgIcon :name="FILTER_MEMBER_SELECT_ALL_ICON" fit />
                        </span>
                      </span>
                    </template>
                  </EgFlotationMenuItem>

                  <EgFlotationMenuItem
                    v-for="option in filteredOptions"
                    :key="option.id"
                    box-type="image-text"
                    :label="option.label"
                    show-checkbox
                    :checked="isDraftSelected(option.id)"
                    :disabled="isMemberRowDisabled(option.id)"
                    :show-tag="false"
                    @click="onOptionClick(option.id)"
                    @update:checked="setDraftChecked(option.id, $event)"
                  >
                    <template #leading>
                      <EgAvatar
                        :name="option.name"
                        :color-seed="option.id"
                        size="sm"
                      />
                    </template>
                  </EgFlotationMenuItem>
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
  </div>
</template>
