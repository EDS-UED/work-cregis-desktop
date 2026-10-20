<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { EgTooltipPanel } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import {
  CUSTOMER_SERVICE_POPUP_HEIGHT,
  CUSTOMER_SERVICE_POPUP_WIDTH,
} from './customerService.constants';
import { customerServiceState } from './customerServiceState';
import CustomerServicePanel from './CustomerServicePanel.vue';
import styles from './CustomerServicePopup.module.css';
import '@eds/desktop-components/styles/overlayGlassMicroFloat.module.css';

const { ui } = useAppI18n();

const hostRef = ref<HTMLElement | null>(null);
const panelMotionActive = ref(false);
let leaveTimer: ReturnType<typeof setTimeout> | undefined;

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: () => customerServiceState.open,
  onClosed: () => {
    customerServiceState.open = false;
  },
});

function clearLeaveTimer() {
  if (leaveTimer !== undefined) {
    clearTimeout(leaveTimer);
    leaveTimer = undefined;
  }
}

function readMotionLeaveMs(el: HTMLElement): number {
  const probe = document.createElement('div');
  probe.className = 'motion-flotation';
  el.appendChild(probe);
  const seconds = Number.parseFloat(getComputedStyle(probe).transitionDuration);
  el.removeChild(probe);
  return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 200;
}

function onClose() {
  popupOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !popupOpen.value) {
    return;
  }
  event.preventDefault();
  onClose();
}

watch(popupOpen, (open) => {
  clearLeaveTimer();
  if (open) {
    panelMotionActive.value = false;
    void nextTick(() => {
      requestAnimationFrame(() => {
        if (popupOpen.value) {
          panelMotionActive.value = true;
        }
      });
    });
    return;
  }

  panelMotionActive.value = false;
  const el = hostRef.value;
  const leaveMs = el ? readMotionLeaveMs(el) : 200;
  leaveTimer = setTimeout(() => {
    leaveTimer = undefined;
    if (!popupOpen.value) {
      onPopupClosed();
    }
  }, leaveMs);
});

watch(popupMounted, (mounted) => {
  if (mounted) {
    document.addEventListener('keydown', onKeydown, { capture: true });
    return;
  }
  document.removeEventListener('keydown', onKeydown, { capture: true });
});

onBeforeUnmount(() => {
  clearLeaveTimer();
  document.removeEventListener('keydown', onKeydown, { capture: true });
});
</script>

<template>
  <div
    v-if="popupMounted"
    ref="hostRef"
    class="customer-service-popup-host"
    :class="styles.host"
    role="presentation"
  >
    <div
      :class="styles.dock"
      data-float-interactive
      role="dialog"
      :aria-label="ui('CregisAI Assistant')"
      aria-modal="false"
    >
      <EgTooltipPanel
        :class="[
          'glassMicroFloatHost',
          panelMotionActive && 'glassMicroFloatHostActive',
        ]"
        panel-kind="popup"
        panel-radius="radius-lg"
        panel-flush
        panel-micro-float
        width-mode="fixed"
        :width="CUSTOMER_SERVICE_POPUP_WIDTH"
        height-mode="fixed"
        :height="CUSTOMER_SERVICE_POPUP_HEIGHT"
        :scrollable="false"
      >
        <CustomerServicePanel @close="onClose" />
      </EgTooltipPanel>
    </div>
  </div>
</template>
