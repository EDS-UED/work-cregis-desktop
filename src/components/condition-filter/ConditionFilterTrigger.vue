<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgIcon,
  EgIconButtonPro,
  POPOVER_PRESET_WIDTH_COMPLEX,
} from '@eds/desktop-components';
import ConditionFilterPanel from './ConditionFilterPanel.vue';
import {
  cloneConditionFilterRows,
  defaultConditionFilterRows,
  filledConditionFilterRows,
  type ConditionFilterFieldOption,
  type ConditionFilterRow,
} from './conditionFilter';

const props = defineProps<{
  label: string;
  icon: string;
  fields: ConditionFilterFieldOption[];
  defaultFieldKeys: string[];
  disabled?: boolean;
}>();

const applied = defineModel<ConditionFilterRow[]>('applied', {
  required: true,
});

const draft = ref(cloneConditionFilterRows(applied.value));

const filterCount = computed(() => filledConditionFilterRows(applied.value).length);

function onOpen() {
  const next = cloneConditionFilterRows(applied.value);
  draft.value = next.length > 0 ? next : defaultConditionFilterRows(props.defaultFieldKeys);
}

function confirm(close: () => void) {
  applied.value = cloneConditionFilterRows(draft.value);
  close();
}

function cancel(close: () => void) {
  draft.value = cloneConditionFilterRows(applied.value);
  close();
}

function clear() {
  draft.value = defaultConditionFilterRows(props.defaultFieldKeys);
}
</script>

<template>
  <EgFlotation
    trigger="click"
    placement="bottom"
    align="end"
    width-mode="fixed"
    :width="POPOVER_PRESET_WIDTH_COMPLEX"
    height-mode="adaptive"
    :show-add="false"
    :show-menu-divider="false"
    boundary-selector=".app-preview"
    flip
    close-on-scroll
    :disabled="disabled"
    @open="onOpen"
  >
    <template #trigger>
      <EgIconButtonPro
        :label="label"
        :badge="filterCount"
        :show-badge="filterCount > 0"
        :disabled="disabled"
      >
        <EgIcon :name="icon" size="sm" />
      </EgIconButtonPro>
    </template>
    <template #content="{ close }">
      <EgFlotationMenu
        panel-radius="radius-md"
        width-mode="fixed"
        :width="POPOVER_PRESET_WIDTH_COMPLEX"
        height-mode="adaptive"
        :scrollable="false"
        :show-add="false"
        :show-divider="false"
      >
        <ConditionFilterPanel
          v-model:conditions="draft"
          :fields="fields"
          @confirm="confirm(close)"
          @cancel="cancel(close)"
          @clear="clear"
        />
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
