<script setup lang="ts">
import { EgPopup } from '@eds/desktop-components';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import {
  CUSTOMER_SERVICE_POPUP_HEIGHT,
  CUSTOMER_SERVICE_POPUP_WIDTH,
} from './customerService.constants';
import { customerServiceState } from './customerServiceState';
import CustomerServicePanel from './CustomerServicePanel.vue';
import './customerService.popupHost.css';

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: () => customerServiceState.open,
  onClosed: () => {
    customerServiceState.open = false;
  },
});

function onClose() {
  popupOpen.value = false;
}
</script>

<template>
  <EgPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    uses="custom"
    :box-width="CUSTOMER_SERVICE_POPUP_WIDTH"
    :box-height="CUSTOMER_SERVICE_POPUP_HEIGHT"
    @close="onPopupClosed"
  >
    <CustomerServicePanel @close="onClose" />
  </EgPopup>
</template>
