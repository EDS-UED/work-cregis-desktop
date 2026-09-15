<script setup lang="ts">
import { EgRadio } from '@eds/desktop-components';
import rowStyles from '@/scenes/tasks/signing/SigningCustomPopupItemRow.module.css';
import styles from './ProjectCreateModeCard.module.css';

defineProps<{
  title: string;
  description: string;
  selected?: boolean;
  radioName: string;
  radioValue: string;
}>();

const emit = defineEmits<{
  select: [];
}>();
</script>

<template>
  <div :class="styles.option">
    <div
      :class="[rowStyles.itemRow, styles.itemRow, selected && styles.itemRowSelected]"
      role="radio"
      tabindex="0"
      :aria-checked="selected"
      @click="emit('select')"
      @keydown.enter.prevent="emit('select')"
      @keydown.space.prevent="emit('select')"
    >
      <div :class="[rowStyles.itemTitle, styles.itemTitleRadio]">
        <EgRadio
          :class="styles.radio"
          :model-value="selected"
          :name="radioName"
          :value="radioValue"
          tabindex="-1"
          aria-hidden="true"
        />
      </div>
      <div :class="[rowStyles.itemValue, styles.itemValueStack]">
        <span :class="[rowStyles.itemValueText, styles.modeTitle]">{{ title }}</span>
        <span :class="[rowStyles.itemValueText, styles.modeDescription]">{{ description }}</span>
      </div>
    </div>
    <div v-if="selected && $slots.default" :class="styles.body">
      <slot />
    </div>
  </div>
</template>
