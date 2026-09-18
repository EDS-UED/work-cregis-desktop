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
  showBatchButton: boolean;
  toolbarBatchButton: ToolbarButton | null | undefined;
  toolbarSectionButtons: ToolbarButton[];
  toolbarActionButtons: ToolbarButton[];
  translate: (key: string) => string;
}>();

const emit = defineEmits<{
  'toolbar-action': [key: string];
}>();
</script>

<template>
  <EgToolBar
    :title="title"
    :show-operation="true"
    :show-divider="true"
    :show-section="showBatchButton"
  >
    <template v-if="showBatchButton && toolbarBatchButton" #functional>
      <EgIconProButton
        :label="translate(toolbarBatchButton.item.label)"
        :badge="toolbarBatchButton.item.badge"
        :show-badge="toolbarBatchButton.item.showBadge"
        :show-reddot="toolbarBatchButton.item.showReddot"
        :disabled="toolbarBatchButton.item.disabled"
        @click="emit('toolbar-action', 'batch')"
      >
        <EgIcon :name="toolbarBatchButton.item.icon" size="sm" />
      </EgIconProButton>
    </template>
    <template v-if="showBatchButton" #section>
      <EgIconProButton
        v-for="button in toolbarSectionButtons"
        :key="button.key"
        :label="translate(button.item.label)"
        :badge="button.item.badge"
        :show-badge="button.item.showBadge"
        :show-reddot="button.item.showReddot"
        :disabled="button.item.disabled"
        @click="emit('toolbar-action', button.key)"
      >
        <EgIcon :name="button.item.icon" size="sm" />
      </EgIconProButton>
    </template>
    <template v-else #functional>
      <EgIconProButton
        v-for="button in toolbarActionButtons"
        :key="`functional-${button.key}`"
        :label="translate(button.item.label)"
        :badge="button.item.badge"
        :show-badge="button.item.showBadge"
        :show-reddot="button.item.showReddot"
        :disabled="button.item.disabled"
        @click="emit('toolbar-action', button.key)"
      >
        <EgIcon :name="button.item.icon" size="sm" />
      </EgIconProButton>
    </template>
  </EgToolBar>
</template>
