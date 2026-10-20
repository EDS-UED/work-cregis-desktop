<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import styles from './ProjectSettingsItem.module.css';

const props = withDefaults(
  defineProps<{
    label: string;
    value?: string;
    copyValue?: string;
    interactive?: boolean;
    showChevron?: boolean;
    reserveActionsSpace?: boolean;
    showValueCopy?: boolean;
  }>(),
  {
    value: undefined,
    copyValue: undefined,
    interactive: false,
    showChevron: true,
    reserveActionsSpace: true,
    showValueCopy: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();

const { ui } = useAppI18n();
const { copied, copyValue } = useCopyableValue();

const textToCopy = computed(() => props.copyValue ?? props.value);
const rowCopyable = computed(() => Boolean(props.showValueCopy && textToCopy.value));

async function onCopyValue(event?: MouseEvent) {
  if (!textToCopy.value) return;
  await copyValue(textToCopy.value, event);
}

function onRootClick(event: MouseEvent) {
  if (rowCopyable.value) {
    void onCopyValue(event);
    return;
  }
  if (props.interactive) emit('click');
}

function onRootKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  if (rowCopyable.value) {
    void onCopyValue();
    return;
  }
  if (props.interactive) emit('click');
}
</script>

<template>
  <div :class="styles.itemShell">
    <div
      :class="[
        styles.root,
        interactive && !rowCopyable && styles.rootInteractive,
        rowCopyable && styles.rootCopyable,
      ]"
      :data-project-settings-copy="rowCopyable ? '' : undefined"
      :role="rowCopyable || interactive ? 'button' : undefined"
      :tabindex="rowCopyable || interactive ? 0 : undefined"
      @click="onRootClick"
      @keydown="onRootKeydown"
    >
      <div :class="styles.dataCombo">
        <span :class="styles.label">{{ label }}</span>
        <div :class="styles.valueRow">
          <slot name="value">
            <span v-if="value" :class="styles.valueRaw">
              <span :class="styles.valueText">{{ value }}</span>
              <span
                v-if="showValueCopy"
                :class="[styles.copyButton, copied && styles.copyButtonCopied]"
                @click.stop
              >
                <DetailValueActionIcon
                  :label="ui('Copy')"
                  :icon="copied ? 'eds-enable-fill' : 'eds-copy'"
                  boundary-selector=".app-preview"
                  @click="onCopyValue($event)"
                />
              </span>
            </span>
          </slot>
        </div>
      </div>
      <div
        v-if="reserveActionsSpace || $slots.actions || (interactive && showChevron)"
        :class="[styles.actions, !($slots.actions || (interactive && showChevron)) && styles.actionsEmpty]"
        @click.stop
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
