<script setup lang="ts">
import { ref } from 'vue';
import {
  closeAllAnchoredTooltips,
  createFilterTranslate,
  EgIcon,
  EgIconButton,
  EgTooltip,
} from '@eds/desktop-components';
import { provideFilterTranslate } from '@eds/desktop-components/organisms/filter/filterTranslate';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAutoRuleOutflowCurrencyAddPickerMenu from './RiskControlAutoRuleOutflowCurrencyAddPickerMenu.vue';
import {
  AUTO_RULE_FILTER_PICKER_MAX_HEIGHT,
  AUTO_RULE_FILTER_PICKER_MENU_WIDTH,
} from './riskControlAutoRuleFilterPickerConstants';
import styles from './RiskControlAutoRuleOutflowCurrencyAddPicker.module.css';

const APP_PREVIEW_BOUNDARY = '.app-preview';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    committedValueKeys: readonly string[];
    allowOpen?: boolean;
  }>(),
  {
    allowOpen: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'before-open': [];
  'open-blocked': [];
}>();

const { locale, ui } = useAppI18n();

provideFilterTranslate((text: string) => {
  const appText = ui(text);
  if (appText !== text) return appText;
  return createFilterTranslate(locale.value)(text);
});

const pickerTooltipRef = ref<{ close?: () => void } | null>(null);
const menuRef = ref<InstanceType<typeof RiskControlAutoRuleOutflowCurrencyAddPickerMenu> | null>(
  null,
);
const pickerOpen = ref(false);

function closePickerPanel() {
  pickerTooltipRef.value?.close?.();
}

function onAddTriggerPointerDown() {
  closeAllAnchoredTooltips();
}

function onAddTriggerClick(event: MouseEvent) {
  if (props.allowOpen) return;
  event.preventDefault();
  event.stopPropagation();
  emit('open-blocked');
}

function onPickerOpen() {
  if (!props.allowOpen) {
    emit('open-blocked');
    closePickerPanel();
    return;
  }
  pickerOpen.value = true;
  emit('before-open');
  menuRef.value?.onPickerOpened();
}

function onPickerClose() {
  pickerOpen.value = false;
  menuRef.value?.onPickerClosed();
}

function onMenuConfirm(value: string) {
  emit('update:modelValue', value);
}
</script>

<template>
  <EgTooltip
    ref="pickerTooltipRef"
    trigger="click"
    placement="bottom"
    align="start"
    :wrap-tooltip="false"
    width-mode="fixed"
    :width="AUTO_RULE_FILTER_PICKER_MENU_WIDTH"
    height-mode="adaptive"
    :max-height="AUTO_RULE_FILTER_PICKER_MAX_HEIGHT"
    :scrollable="false"
    :boundary-selector="APP_PREVIEW_BOUNDARY"
    :teleport-to="APP_PREVIEW_BOUNDARY"
    flip
    :close-on-scroll="false"
    @open="onPickerOpen"
    @close="onPickerClose"
  >
    <EgIconButton
      data-eds-trigger-metrics
      shape="rectangular"
      outline-style="bordered"
      size="lg"
      :label="ui('Add')"
      :class="[styles.addIconTriggerHost, pickerOpen && styles.addIconTriggerExpanded]"
      :aria-expanded="pickerOpen"
      @pointerdown.capture="onAddTriggerPointerDown"
      @click.capture="onAddTriggerClick"
    >
      <EgIcon name="eds-add-medium" fit />
    </EgIconButton>

    <template #content>
      <RiskControlAutoRuleOutflowCurrencyAddPickerMenu
        ref="menuRef"
        :committed-value-keys="props.committedValueKeys"
        :menu-width="AUTO_RULE_FILTER_PICKER_MENU_WIDTH"
        menu-width-mode="fixed"
        :close-panel="closePickerPanel"
        @confirm="onMenuConfirm"
      />
    </template>
  </EgTooltip>
</template>
