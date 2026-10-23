<script setup lang="ts">
import { toRef } from 'vue';
import {
  EgButton,
  EgDialog,
  EgDialogPopup,
  EgDivider,
  type ButtonTone,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';

const props = withDefaults(
  defineProps<{
    open: boolean;
    titleKey: string;
    messageKey: string;
    confirmLabelKey?: string;
    confirmTone?: ButtonTone;
    confirmDisabled?: boolean;
  }>(),
  {
    confirmLabelKey: 'Confirm',
    confirmTone: 'decor',
    confirmDisabled: false,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  confirm: [];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

function onCancel() {
  popupOpen.value = false;
}

function onConfirm() {
  if (props.confirmDisabled) return;
  emit('confirm');
  popupOpen.value = false;
}
</script>

<template>
  <EgDialogPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    dialog-type="standard"
    alert-vertical-align="offset-top"
    @close="onPopupClosed"
  >
    <EgDialog
      type="standard"
      :title="ui(titleKey)"
      :secondary-text="ui(messageKey)"
      :show-secondary-text="true"
    >
      <template #actions>
        <div :class="comboActionStyles.flotationRoot">
          <EgDivider
            :class="[
              comboActionStyles.divider,
              comboActionStyles.dividerAnimated,
              comboActionStyles.dividerAnimatedHidden,
            ]"
            type="module"
            direction="horizontal"
            hide
          />
          <div
            :class="[
              comboActionStyles.flotationBar,
              comboActionStyles.flotationBarEnd,
              comboActionStyles.flotationBarInset5,
            ]"
          >
            <div :class="comboActionStyles.flotationActions">
              <EgButton tone="subtle" variant="text" size="md" @click="onCancel">
                {{ ui('Cancel') }}
              </EgButton>
              <EgButton
                :tone="confirmTone"
                variant="solid"
                size="md"
                :disabled="confirmDisabled"
                @click="onConfirm"
              >
                {{ ui(confirmLabelKey) }}
              </EgButton>
            </div>
          </div>
        </div>
      </template>
    </EgDialog>
  </EgDialogPopup>
</template>
