<script setup lang="ts">
import { computed } from 'vue';
import type { EgFilterFieldCurrencyOption, TooltipWidthMode } from '@eds/desktop-components';
import {
  EgComboFloatButton,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgSearchInput,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import {
  FILTER_CURRENCY_CASCADE_PICKER_HEIGHT,
  FILTER_CURRENCY_CASCADE_PICKER_WIDTH,
} from '@eds/desktop-components/organisms/filter/filterCurrencyPresets';
import { useAppI18n } from '@/composables/useAppI18n';
import { AUTO_RULE_FILTER_PICKER_MAX_HEIGHT } from './riskControlAutoRuleFilterPickerConstants';
import { useRiskControlAutoRuleOutflowCurrencyAddPickerMenu } from './useRiskControlAutoRuleOutflowCurrencyAddPickerMenu';
import styles from './RiskControlAutoRuleOutflowCurrencyAddPickerMenu.module.css';

const FILTER_CURRENCY_SELECT_ALL_ICON = 'eds-list-lattice-mobile-fill';
const CASCADE_BOUNDARY_SELECTOR = '.app-preview';

const props = defineProps<{
  currencyOptions: readonly EgFilterFieldCurrencyOption[];
  committedValueKeys: readonly string[];
  menuWidth?: number;
  menuWidthMode: TooltipWidthMode;
  closePanel: () => void;
}>();

const emit = defineEmits<{
  confirm: [value: string];
  cancel: [];
}>();

const { ui } = useAppI18n();

const currencyOptionsRef = computed(() => props.currencyOptions);
const committedValueKeysRef = computed(() => props.committedValueKeys);

const {
  searchQuery,
  scrollRef,
  optionListRef,
  filteredOptions,
  showSearchEmpty,
  pickerCanScroll,
  pickerTopScrim,
  pickerBottomScrim,
  cascadeSubmenuStyle,
  cascadeTopScrim,
  selectAllChecked,
  selectAllIndeterminate,
  hasDraftSelection,
  resolveOptionModeTag,
  showOptionParentMessage,
  getOptionParentMessageText,
  isOptionParentCheckboxChecked,
  isCascadeFlotationDisabled,
  getNetworkSelectAllMode,
  hasOptionDraftSelection,
  isOptionSelected,
  isNetworkSelected,
  setCascadeScrollRef,
  setCascadeListRef,
  onSelectAllToggle,
  onCheckboxUpdate,
  onNetworkCheckboxUpdate,
  onOptionClick,
  onNetworkClick,
  onNetworkSelectAllToggle,
  onCascadeOpen,
  onCascadeConfirm,
  onCascadeCancel,
  onCascadeClear,
  onCascadeRowEnter,
  onCascadeFlotationClose,
  onPickerClear,
  buildConfirmValue,
  onPickerOpened,
  onPickerClosed,
  clearActiveCascade,
  isOptionRowDisabled,
  isNetworkRowDisabled,
} = useRiskControlAutoRuleOutflowCurrencyAddPickerMenu({
  currencyOptions: currencyOptionsRef,
  committedValueKeys: committedValueKeysRef,
  translate: (key) => ui(key),
});

defineExpose({
  onPickerOpened,
  onPickerClosed,
});

function onConfirm() {
  emit('confirm', buildConfirmValue());
  onPickerClosed();
  props.closePanel();
}

function onCancel() {
  onPickerClosed();
  emit('cancel');
  props.closePanel();
}
</script>

<template>
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
                  <EgIcon :name="FILTER_CURRENCY_SELECT_ALL_ICON" fit />
                </span>
              </span>
            </template>
          </EgFlotationMenuItem>

          <template v-for="option in filteredOptions" :key="option.id">
            <div
              v-if="option.multiChain && option.networks?.length"
              :class="styles.optionRowWrap"
              :data-currency-key="option.id"
              @mouseenter="onCascadeRowEnter(option.id)"
            >
              <EgFlotation
                :class="styles.networkFlotation"
                placement="right"
                align="start"
                flip
                trigger="hover"
                width-mode="fixed"
                :width="FILTER_CURRENCY_CASCADE_PICKER_WIDTH"
                :show-add="false"
                :show-menu-divider="false"
                :disabled="isCascadeFlotationDisabled(option.id) || isOptionRowDisabled(option)"
                :boundary-selector="CASCADE_BOUNDARY_SELECTOR"
                close-on-scroll
                @open="onCascadeOpen(option)"
                @close="onCascadeFlotationClose(option.id)"
              >
                <template #trigger>
                  <div :class="styles.cascadeRow" data-eds-trigger-metrics>
                    <EgFlotationMenuItem
                      host-tag="div"
                      box-type="image-text"
                      :label="option.label"
                      :symbol-icon="option.cryptoName"
                      :mode-tag="resolveOptionModeTag(option)"
                      :show-message="showOptionParentMessage(option)"
                      :message-text="getOptionParentMessageText(option)"
                      message-type="subtle"
                      message-static
                      show-cascader
                      :show-tag="false"
                      show-checkbox
                      :checked="isOptionParentCheckboxChecked(option)"
                      :checkbox-indeterminate="false"
                      :disabled="isOptionRowDisabled(option)"
                      @click="onOptionClick(option)"
                      @update:checked="onCheckboxUpdate(option, $event)"
                    />
                  </div>
                </template>
                <template #content="{ close: closeNetwork }">
                  <EgFlotationMenu
                    :class="styles.networkSubmenu"
                    :style="cascadeSubmenuStyle"
                    data-no-corner-smoothing
                    panel-flush
                    panel-radius="radius-md"
                    width-mode="fixed"
                    :width="FILTER_CURRENCY_CASCADE_PICKER_WIDTH"
                    height-mode="adaptive"
                    :max-height="FILTER_CURRENCY_CASCADE_PICKER_HEIGHT"
                    :scrollable="false"
                    :show-add="false"
                    :show-divider="false"
                  >
                    <div :class="styles.cascadePanel">
                      <div
                        :ref="(element) =>
                          setCascadeScrollRef(option.id, element as HTMLElement | null)"
                        :class="[
                          styles.cascadeListScroll,
                          cascadeTopScrim && styles.listScrollFadeTop,
                        ]"
                      >
                        <div
                          :ref="(element) =>
                            setCascadeListRef(option.id, element as HTMLElement | null)"
                          :class="styles.cascadeList"
                        >
                          <EgFlotationMenuItem
                            data-eds-filter-cascade-item
                            box-type="image-text"
                            :label="ui('All')"
                            show-checkbox
                            :checked="getNetworkSelectAllMode(option) === 'all'"
                            :checkbox-indeterminate="getNetworkSelectAllMode(option) === 'some'"
                            :show-tag="false"
                            @click="onNetworkSelectAllToggle(option)"
                            @update:checked="onNetworkSelectAllToggle(option)"
                          >
                            <template #leading>
                              <span :class="styles.selectAllIcon">
                                <span :class="styles.selectAllIconGlyph">
                                  <EgIcon :name="FILTER_CURRENCY_SELECT_ALL_ICON" fit />
                                </span>
                              </span>
                            </template>
                          </EgFlotationMenuItem>
                          <EgFlotationMenuItem
                            v-for="network in option.networks"
                            :key="`${option.id}-${network.key}`"
                            data-eds-filter-cascade-item
                            box-type="image-text"
                            :label="network.label"
                            :symbol-icon="network.cryptoName"
                            :show-tag="false"
                            show-checkbox
                            :checked="isNetworkSelected(option, network.key)"
                            :disabled="isNetworkRowDisabled(option, network.key)"
                            @click="onNetworkClick(option, network.key)"
                            @update:checked="
                              onNetworkCheckboxUpdate(option, network.key, $event)
                            "
                          />
                        </div>
                      </div>
                      <EgComboFloatButton
                        :class="styles.cascadeAction"
                        tone="decor"
                        :count="2"
                        :clear="hasOptionDraftSelection(option)"
                        direction="right"
                        bar-padding="compact"
                        divider
                        :cancel-label="ui('Cancel')"
                        :confirm-label="ui('Confirm')"
                        @clear="onCascadeClear(option)"
                        @cancel="onCascadeCancel(option, closeNetwork)"
                        @confirm="onCascadeConfirm(closeNetwork)"
                      />
                    </div>
                  </EgFlotationMenu>
                </template>
              </EgFlotation>
            </div>

            <EgFlotationMenuItem
              v-else
              box-type="image-text"
              :label="option.label"
              :symbol-icon="option.cryptoName"
              :mode-tag="resolveOptionModeTag(option)"
              :show-message="Boolean(option.multiChain && option.messageText)"
              :message-text="option.messageText ?? ''"
              message-static
              show-checkbox
              :checked="isOptionSelected(option)"
              :disabled="isOptionRowDisabled(option)"
              :show-tag="false"
              @mouseenter="clearActiveCascade"
              @click="onOptionClick(option)"
              @update:checked="onCheckboxUpdate(option, $event)"
            />
          </template>
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
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </div>
  </EgFlotationMenu>
</template>
