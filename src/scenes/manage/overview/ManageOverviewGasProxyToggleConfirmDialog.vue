<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgDialog, EgDialogPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import styles from './ManageOverviewGasProxyToggleConfirmDialog.module.css';

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
  ui(
    props.enabling
      ? 'Overview Enable Gas Proxy'
      : 'Overview Gas Proxy Disable Dialog Title',
  ),
);

const dialogMessage = computed(() =>
  ui(
    props.enabling
      ? 'Overview Gas Proxy Enable Confirm Message'
      : 'Overview Gas Proxy Disable Confirm Message',
  ),
);

const enableWarningHintText = computed(() =>
  ui('Overview Gas Proxy Enable Confirm Hint With Label'),
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
    >
      <template v-if="enabling" #body>
        <p :class="styles.enableWarningHint">{{ enableWarningHintText }}</p>
      </template>
    </EgDialog>
  </EgDialogPopup>
</template>
