<script setup lang="ts">
import { EgIcon, EgIconProButton, EgToolBar } from '@eds/desktop-components';
type ToolbarButton = {
  key: string;
  item: {
    label: string;
    icon: string;
    badge?: string;
    showBadge?: boolean;
    showReddot?: boolean;
    disabled?: boolean;
  };
};

defineProps<{
  title: string;
  showToolbarSection: boolean;
  toolbarFunctionalButtons: ToolbarButton[];
  toolbarSectionButtons: ToolbarButton[];
  toolbarActionButtons: ToolbarButton[];
  translate: (key: string) => string;
}>();

const emit = defineEmits<{
  'toolbar-action': [key: string, event: MouseEvent];
}>();

function renderAddNewSlot(button: ToolbarButton) {
  return button.key === 'addNew';
}
</script>

<template>
  <EgToolBar
    :title="title"
    :show-operation="true"
    :show-divider="true"
    :show-section="showToolbarSection"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="showToolbarSection" #functional>
      <EgIconProButton
        v-for="button in toolbarFunctionalButtons"
        :key="`functional-${button.key}`"
        :label="translate(button.item.label)"
        :badge="button.item.badge"
        :show-badge="button.item.showBadge"
        :show-reddot="button.item.showReddot"
        :disabled="button.item.disabled"
        @click="(event) => emit('toolbar-action', button.key, event)"
      >
        <EgIcon :name="button.item.icon" size="sm" />
      </EgIconProButton>
    </template>
    <template v-if="showToolbarSection" #section>
      <slot name="section-prefix" />
      <template v-for="button in toolbarSectionButtons" :key="button.key">
        <slot
          v-if="renderAddNewSlot(button) && $slots['add-new']"
          name="add-new"
          :button="button"
        />
        <EgIconProButton
          v-else
          :label="translate(button.item.label)"
          :badge="button.item.badge"
          :show-badge="button.item.showBadge"
          :show-reddot="button.item.showReddot"
          :disabled="button.item.disabled"
          @click="(event) => emit('toolbar-action', button.key, event)"
        >
          <EgIcon :name="button.item.icon" size="sm" />
        </EgIconProButton>
      </template>
    </template>
    <template v-else #functional>
      <slot name="functional-prefix" />
      <template v-for="button in toolbarActionButtons" :key="`functional-${button.key}`">
        <slot
          v-if="renderAddNewSlot(button) && $slots['add-new']"
          name="add-new"
          :button="button"
        />
        <EgIconProButton
          v-else
          :label="translate(button.item.label)"
          :badge="button.item.badge"
          :show-badge="button.item.showBadge"
          :show-reddot="button.item.showReddot"
          :disabled="button.item.disabled"
          @click="(event) => emit('toolbar-action', button.key, event)"
        >
          <EgIcon :name="button.item.icon" size="sm" />
        </EgIconProButton>
      </template>
    </template>
  </EgToolBar>
</template>
