<script setup lang="ts">
import { toRef } from 'vue';
import { EgDialog, EgDialogPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '../shared/usePopupShellLifecycle';

const props = defineProps<{
  open: boolean;
  titleKey: string;
  messageKey: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  continue: [];
  reject: [];
  close: [];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
    emit('close');
  },
});

function onReject() {
  emit('reject');
  popupOpen.value = false;
}

function onContinue() {
  emit('continue');
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
      :cancel-label="ui('Reject')"
      :confirm-label="ui('Continue')"
      @cancel="onReject"
      @confirm="onContinue"
    />
  </EgDialogPopup>
</template>
