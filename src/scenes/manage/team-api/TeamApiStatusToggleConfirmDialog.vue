<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgDialog, EgDialogPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';

const props = defineProps<{
  open: boolean;
  enabling: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

const dialogTitle = computed(() =>
  ui(props.enabling ? 'Enable API Key' : 'Disable API Key'),
);

const dialogMessage = computed(() =>
  ui(
    props.enabling
      ? 'Team API enable confirm message'
      : 'Team API disable confirm message',
  ),
);

function onConfirm() {
  emit('confirm');
  popupOpen.value = false;
}

function onCancel() {
  emit('cancel');
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
      :title="dialogTitle"
      :secondary-text="dialogMessage"
      :show-secondary-text="true"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </EgDialogPopup>
</template>
