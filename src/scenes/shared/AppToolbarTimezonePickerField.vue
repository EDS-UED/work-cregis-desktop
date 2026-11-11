<script setup lang="ts">
import { computed } from 'vue';
import { EgFlotation, EgFlotationTrigger } from '@eds/desktop-components';
import { TOOLBAR_TIMEZONE_ITEMS } from './toolbarTimezoneItems';
import styles from './AppToolbarTimezonePickerField.module.css';

const selectedIndex = defineModel<number>({ required: true });

const props = withDefaults(
  defineProps<{
    /** `md-full`：概览 / 偏好；`xs`：列表 ToolBar 标题区。 */
    variant?: 'md-full' | 'xs';
  }>(),
  {
    variant: 'md-full',
  },
);

const selectedTimezoneLabel = computed(
  () => TOOLBAR_TIMEZONE_ITEMS[selectedIndex.value]?.label ?? 'UTC+08:00',
);

const isMdFull = computed(() => props.variant === 'md-full');
</script>

<template>
  <EgFlotation
    :class="[styles.root, isMdFull && styles.rootMdFull]"
    v-model:selected-index="selectedIndex"
    :items="TOOLBAR_TIMEZONE_ITEMS"
    :trigger-label="isMdFull ? undefined : selectedTimezoneLabel"
    :trigger-size="isMdFull ? undefined : 'xs'"
    message-text="0"
    add-label="Add"
    placement="bottom"
    align="start"
    flip
    width-mode="trigger"
    height-mode="adaptive"
    list-scroll
    :max-height="320"
    :show-add="false"
    :show-menu-divider="false"
    boundary-selector=".app-preview"
    close-on-scroll
  >
    <template v-if="isMdFull" #trigger="{ expanded }">
      <EgFlotationTrigger
        :class="styles.mdFullTrigger"
        trigger-style="subtle"
        size="md"
        width-mode="adaptive"
        :label="selectedTimezoneLabel"
        :expanded="expanded"
        :label-overflow-tooltip="false"
      />
    </template>
  </EgFlotation>
</template>
