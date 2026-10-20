<script setup lang="ts">
import { EgRadio } from '@eds/desktop-components';
import styles from './ProjectCreateModeCard.module.css';

const props = defineProps<{
  title: string;
  description: string;
  selected?: boolean;
  radioName: string;
  radioValue: string;
}>();

const emit = defineEmits<{
  select: [];
}>();

function onRowActivate(event: MouseEvent | KeyboardEvent) {
  const wasSelected = props.selected;
  emit('select');
  if (wasSelected && event.currentTarget instanceof HTMLElement) {
    event.currentTarget.blur();
  }
}
</script>

<template>
  <div :class="styles.option">
    <div
      :class="[styles.itemRow, selected && styles.itemRowSelected]"
      role="radio"
      tabindex="0"
      :aria-checked="selected"
      @click="onRowActivate"
      @keydown.enter.prevent="onRowActivate"
      @keydown.space.prevent="onRowActivate"
    >
      <EgRadio
        :class="styles.radio"
        :model-value="selected"
        :name="radioName"
        :value="radioValue"
        tabindex="-1"
        aria-hidden="true"
      />
      <div :class="styles.itemValueStack">
        <span :class="styles.modeTitle">{{ title }}</span>
        <span :class="styles.modeDescription">{{ description }}</span>
      </div>
    </div>
    <div v-if="selected && $slots.default" :class="styles.body">
      <slot />
    </div>
  </div>
</template>
