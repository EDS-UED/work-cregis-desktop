<script setup lang="ts">
import { toRef } from 'vue';
import { EgBusinessDialog, EgPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import type { TeamApiConfigRecord } from './teamApiMockData';
import TeamApiKeyRevealBody from './TeamApiKeyRevealBody.vue';
import styles from '@/scenes/manage/webhook/WebhookKeyRevealDialog.module.css';

const props = defineProps<{
  open: boolean;
  record: TeamApiConfigRecord | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

function onConfirm() {
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
      :title="ui('View API Key')"
      :show-secondary-text="false"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <template #default>
        <TeamApiKeyRevealBody :record="record" :active="open" />
      </template>
    </EgBusinessDialog>
  </EgPopup>
</template>
