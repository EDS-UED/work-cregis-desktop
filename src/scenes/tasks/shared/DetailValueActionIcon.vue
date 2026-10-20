<script setup lang="ts">
import { EgTooltip, EgIcon, EgIconButton } from '@eds/desktop-components';
import type { ButtonSize } from '@eds/desktop-components/molecules/button/Button.vue';
import styles from './DetailValueActionIcon.module.css';

withDefaults(
  defineProps<{
    label: string;
    icon: string;
    boundarySelector?: string;
    tooltipAlign?: 'start' | 'center' | 'end';
    buttonSize?: ButtonSize;
  }>(),
  {
    boundarySelector: '.eds-popup',
    tooltipAlign: 'center',
    buttonSize: 'xs',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <EgTooltip
    trigger="hover"
    placement="bottom"
    :align="tooltipAlign"
    panel-kind="flotation"
    width-mode="adaptive"
    height-mode="adaptive"
    :scrollable="false"
    close-on-scroll
    :boundary-selector="boundarySelector"
    :open-delay="120"
    :close-delay="80"
    token-scope-class="desktopTokens"
  >
    <EgIconButton
      shape="square"
      :size="buttonSize"
      :label="label"
      @click="emit('click', $event)"
    >
      <EgIcon :name="icon" fit />
    </EgIconButton>
    <template #content>
      <span
        :class="[
          styles.tooltipLabel,
          tooltipAlign === 'end' && styles.tooltipLabelAlignEnd,
        ]"
      >
        {{ label }}
      </span>
    </template>
  </EgTooltip>
</template>
