<script setup lang="ts">
import { toRef } from 'vue';
import {
  EgGoogleVerify,
  EgVerifyPopup,
  closeAllAnchoredTooltips,
  useVerifySubmit,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import { WEBHOOK_GOOGLE_VERIFY_MOCK_CODE } from './webhookMockData';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  verified: [];
  closed: [];
}>();

const { ui } = useAppI18n();

const {
  verify,
  onComplete,
  onRecover,
  reset,
  wasAccepted,
} = useVerifySubmit({
  submit: (code) => code.trim() === WEBHOOK_GOOGLE_VERIFY_MOCK_CODE,
  requestClose: () => {
    popupOpen.value = false;
  },
});

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onBeforeOpen: () => {
    closeAllAnchoredTooltips();
    reset();
  },
  onClosed: () => {
    emit('update:open', false);
    if (wasAccepted()) emit('verified');
    emit('closed');
    reset();
  },
});

function closePopup() {
  popupOpen.value = false;
}
</script>

<template>
  <EgVerifyPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    verify-type="single-google"
    @close="onPopupClosed"
  >
    <EgGoogleVerify
      v-model="verify.code"
      action-tone="decor"
      :state="verify.state"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      :switch-disabled="verify.switchDisabled"
      :countdown-seconds="verify.state === 'error' ? null : undefined"
      @complete="onComplete"
      @recover="onRecover"
      @switch="closePopup"
      @cancel="closePopup"
    />
  </EgVerifyPopup>
</template>
