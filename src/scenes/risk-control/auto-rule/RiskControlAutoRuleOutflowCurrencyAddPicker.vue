<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  closeAllAnchoredTooltips,
  createFilterTranslate,
  EgFlotation,
  EgIcon,
  EgIconButton,
} from '@eds/desktop-components';
import { provideFilterTranslate } from '@eds/desktop-components/organisms/filter/filterTranslate';
import { useAppI18n } from '@/composables/useAppI18n';
import { buildAutoRuleOutflowCurrencyAddPickerOptions } from './buildAutoRuleOutflowCurrencyAddPickerOptions';
import RiskControlAutoRuleOutflowCurrencyAddPickerMenu from './RiskControlAutoRuleOutflowCurrencyAddPickerMenu.vue';
import {
  AUTO_RULE_FILTER_PICKER_MAX_HEIGHT,
  AUTO_RULE_FILTER_PICKER_MENU_WIDTH,
} from './riskControlAutoRuleFilterPickerConstants';
import styles from './RiskControlAutoRuleOutflowCurrencyAddPicker.module.css';

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

const flotationRef = ref<{ close?: () => void } | null>(null);
const menuRef = ref<InstanceType<typeof RiskControlAutoRuleOutflowCurrencyAddPickerMenu> | null>(
  null,
);

const pickerCurrencyOptions = computed(() => buildAutoRuleOutflowCurrencyAddPickerOptions());

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
    flotationRef.value?.close?.();
    return;
  }
  emit('before-open');
  menuRef.value?.onPickerOpened();
}

function onPickerClose() {
  menuRef.value?.onPickerClosed();
}

function onMenuConfirm(value: string) {
  emit('update:modelValue', value);
}
</script>

<template>
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
        @click.capture="onAddTriggerClick"
      >
        <EgIcon name="eds-add-medium" fit />
      </EgIconButton>
    </template>

    <template #content="{ close, menuWidth, menuWidthMode }">
      <RiskControlAutoRuleOutflowCurrencyAddPickerMenu
        ref="menuRef"
        :currency-options="pickerCurrencyOptions"
        :committed-value-keys="props.committedValueKeys"
        :menu-width="menuWidth"
        :menu-width-mode="menuWidthMode"
        :close-panel="close"
        @confirm="onMenuConfirm"
      />
    </template>
  </EgFlotation>
</template>
