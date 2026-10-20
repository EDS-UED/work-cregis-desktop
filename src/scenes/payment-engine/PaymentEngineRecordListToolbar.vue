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
  'toolbar-action': [key: string];
}>();
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
        @click="emit('toolbar-action', button.key)"
      >
        <EgIcon :name="button.item.icon" size="sm" />
      </EgIconProButton>
    </template>
    <template v-if="showToolbarSection" #section>
      <slot name="section-prefix" />
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
      <slot name="functional-prefix" />
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
