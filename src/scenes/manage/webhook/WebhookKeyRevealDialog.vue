<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgBusinessDialog, EgPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import type { WebhookConfigRecord } from './webhookMockData';
import WebhookKeyRevealCreatedBody from './WebhookKeyRevealCreatedBody.vue';
import WebhookKeyRevealViewKeyBody from './WebhookKeyRevealViewKeyBody.vue';
import styles from './WebhookKeyRevealDialog.module.css';

const props = defineProps<{
  open: boolean;
  record: WebhookConfigRecord | null;
  oneTimeCreate?: boolean;
}>();

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

const dialogTitle = computed(() =>
  ui(props.oneTimeCreate ? 'Webhook secret created title' : 'View Webhook Key'),
);

const isCreateSuccessBody = computed(() => props.oneTimeCreate === true);

function onConfirm() {
  emit('confirm');
  popupOpen.value = false;
}

function onCancel() {
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
      :title="dialogTitle"
      :show-secondary-text="isCreateSuccessBody"
      :secondary-text="ui('Webhook HMAC secret intro')"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <template #default>
        <WebhookKeyRevealCreatedBody
          v-if="isCreateSuccessBody"
          :record="record"
          :active="open"
        />
        <WebhookKeyRevealViewKeyBody v-else :record="record" :active="open" />
      </template>
    </EgBusinessDialog>
  </EgPopup>
</template>
