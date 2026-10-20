<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
import {
  EgBusinessDialog,
  EgComboInput,
  EgInput,
  EgPopup,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import styles from './CallbackPushOrderDialog.module.css';

const props = defineProps<{
  open: boolean;
  callbackUrl: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  confirm: [callbackUrl: string];
  cancel: [];
}>();

const { ui } = useAppI18n();

const callbackUrlDraft = ref('');

watch(
  () => [props.open, props.callbackUrl] as const,
  ([open, url]) => {
    if (open) {
      callbackUrlDraft.value = url;
    }
  },
  { immediate: true },
);

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

function onConfirm() {
  emit('confirm', callbackUrlDraft.value.trim());
  popupOpen.value = false;
}

function onCancel() {
  emit('cancel');
  popupOpen.value = false;
}
</script>

<template>
  <EgPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    uses="dialog"
    dialog-type="compose"
    alert-vertical-align="offset-top"
    @close="onPopupClosed"
  >
    <EgBusinessDialog
      :class="styles.dialogHost"
      toolbar-divider-pinned
      :title="ui('Push Order')"
      :show-secondary-text="true"
      :secondary-text="ui('Callback push order confirm message')"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <EgComboInput :label="ui('Callback URL')">
        <EgInput
          v-model="callbackUrlDraft"
          width-mode="full"
          :placeholder="ui('Please Enter')"
        />
      </EgComboInput>
    </EgBusinessDialog>
  </EgPopup>
</template>
