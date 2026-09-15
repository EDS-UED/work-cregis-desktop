<script setup lang="ts">
import { EgIcon, EgIconButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ProjectSettingsItem.module.css';

const { ui } = useAppI18n();

withDefaults(
  defineProps<{
    label: string;
    value?: string;
    interactive?: boolean;
    showChevron?: boolean;
    reserveActionsSpace?: boolean;
    showValueCopy?: boolean;
  }>(),
  {
    value: undefined,
    interactive: false,
    showChevron: true,
    reserveActionsSpace: true,
    showValueCopy: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <div :class="styles.itemShell">
    <div
      :class="[styles.root, interactive && styles.rootInteractive]"
      :role="interactive ? 'button' : undefined"
      :tabindex="interactive ? 0 : undefined"
      @click="interactive ? emit('click') : undefined"
      @keydown.enter.prevent="interactive ? emit('click') : undefined"
      @keydown.space.prevent="interactive ? emit('click') : undefined"
    >
      <div :class="styles.dataCombo">
        <span :class="styles.label">{{ label }}</span>
        <div :class="styles.valueRow">
          <slot name="value">
            <span v-if="value" :class="styles.valueRaw">
              <span :class="styles.valueText">{{ value }}</span>
              <EgIconButton
                v-if="showValueCopy"
                :class="styles.valueCopyButton"
                size="xs"
                shape="rectangular"
                :label="ui('Copy')"
                type="button"
              >
                <EgIcon name="eds-copy" />
              </EgIconButton>
            </span>
          </slot>
        </div>
      </div>
      <div
        v-if="reserveActionsSpace || $slots.actions || (interactive && showChevron)"
        :class="[styles.actions, !($slots.actions || (interactive && showChevron)) && styles.actionsEmpty]"
      >
        <slot name="actions" />
        <EgIcon
          v-if="interactive && showChevron"
          :class="styles.chevron"
          name="eds-chevron-right"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>
