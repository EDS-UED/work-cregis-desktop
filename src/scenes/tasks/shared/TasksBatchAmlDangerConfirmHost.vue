<script setup lang="ts">
import { EgConfirmPopover } from '@eds/desktop-components';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  queryBatchBarPopoverMountTarget,
  resolveBatchAmlDangerConfirmAnchor,
} from './resolveBatchAmlDangerActionAnchor';
import {
  clearBatchAmlAnchorPressed,
  syncBatchAmlAnchorPressed,
} from './batchAmlDangerGateChrome';
import styles from './TasksBatchAmlDangerConfirmHost.module.css';

const props = defineProps<{
  activateToken: number;
  anchorEl?: HTMLElement | null;
}>();

const emit = defineEmits<{
  confirm: [];
  dismiss: [];
}>();

const { ui } = useAppI18n();

const TASK_AML_DANGER_CONFIRM_WIDTH = 365;

const openPopoverFromTrigger = ref<(event: MouseEvent) => void>(() => {});

/** EgConfirmPopover confirm 后会 close → dismiss；勿当作用户取消。 */
const closingAfterConfirm = ref(false);

/** trigger slot 尚未 register 时排队，避免 open 调用空函数导致 gate 永久挂起。 */
const pendingOpenWhenTriggerReady = ref(false);

const triggerStyle = ref<Record<string, string>>({
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '1px',
  height: '1px',
});

let triggerSyncObserver: ResizeObserver | undefined;

function resolveAnchorElement(): HTMLElement | null {
  return resolveBatchAmlDangerConfirmAnchor(
    props.anchorEl,
    ui('Pass'),
    ui('Sign'),
  );
}

function resolveTriggerPositionMount(): HTMLElement | null {
  return queryBatchBarPopoverMountTarget();
}

function syncTriggerToAnchor() {
  const el = resolveAnchorElement();
  const mount = resolveTriggerPositionMount();
  if (!el || !mount) return;

  const rect = el.getBoundingClientRect();
  const mountRect = mount.getBoundingClientRect();
  triggerStyle.value = {
    position: 'absolute',
    left: `${rect.left - mountRect.left}px`,
    top: `${rect.top - mountRect.top}px`,
    width: `${Math.max(rect.width, 1)}px`,
    height: `${Math.max(rect.height, 1)}px`,
  };
}

function observeTriggerSyncTargets() {
  triggerSyncObserver?.disconnect();
  triggerSyncObserver = new ResizeObserver(() => {
    syncTriggerToAnchor();
  });

  const anchor = resolveAnchorElement();
  const mount = resolveTriggerPositionMount();
  if (anchor) {
    triggerSyncObserver.observe(anchor);
  }
  if (mount) {
    triggerSyncObserver.observe(mount);
  }
  syncTriggerToAnchor();
}

function waitForLayoutPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function openConfirmAlignedToBatchPass() {
  syncTriggerToAnchor();
  await nextTick();
  await waitForLayoutPaint();
  syncTriggerToAnchor();
  openPopoverFromTrigger.value(
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  );
}

const triggerRegistered = ref(false);

function scheduleOpenWhenReady() {
  pendingOpenWhenTriggerReady.value = true;
  if (triggerRegistered.value) {
    pendingOpenWhenTriggerReady.value = false;
    void openConfirmAlignedToBatchPass();
  }
}

function registerPopoverTrigger(onClick: (event: MouseEvent) => void) {
  openPopoverFromTrigger.value = onClick;
  triggerRegistered.value = true;
  if (pendingOpenWhenTriggerReady.value) {
    pendingOpenWhenTriggerReady.value = false;
    void openConfirmAlignedToBatchPass();
  }
}

function clearAnchorPressedVisual() {
  clearBatchAmlAnchorPressed(resolveAnchorElement());
}

function syncAnchorPressedVisual(active: boolean) {
  syncBatchAmlAnchorPressed(active, resolveAnchorElement());
}

watch(
  () => props.activateToken,
  (token) => {
    if (token <= 0) return;
    scheduleOpenWhenReady();
  },
);

watch(
  () => props.anchorEl,
  () => {
    if (props.activateToken > 0) {
      observeTriggerSyncTargets();
    }
  },
);

function onViewportScrollOrResize() {
  if (props.activateToken > 0) {
    syncTriggerToAnchor();
  }
}

function onConfirm() {
  closingAfterConfirm.value = true;
  clearAnchorPressedVisual();
  emit('confirm');
}

function onDismiss() {
  clearAnchorPressedVisual();
  if (closingAfterConfirm.value) {
    closingAfterConfirm.value = false;
    return;
  }
  emit('dismiss');
}

onMounted(() => {
  window.addEventListener('scroll', onViewportScrollOrResize, true);
  window.addEventListener('resize', onViewportScrollOrResize);
  if (props.activateToken > 0) {
    observeTriggerSyncTargets();
    scheduleOpenWhenReady();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onViewportScrollOrResize, true);
  window.removeEventListener('resize', onViewportScrollOrResize);
  triggerSyncObserver?.disconnect();
  triggerSyncObserver = undefined;
  clearAnchorPressedVisual();
});
</script>

<template>
  <div :class="styles.host">
    <EgConfirmPopover
      :title="ui('Task AML dangerous address confirm title')"
      :message="ui('Task AML dangerous address confirm message')"
      :confirm-label="ui('Task AML dangerous address confirm acknowledge')"
      :close-label="ui('Close')"
      placement="top"
      align="center"
      height-mode="adaptive"
      :width="TASK_AML_DANGER_CONFIRM_WIDTH"
      boundary-selector=".eds-data-list"
      teleport-to=".app-preview"
      @confirm="onConfirm"
      @dismiss="onDismiss"
    >
      <template #trigger="{ onClick, active }">
        {{ registerPopoverTrigger(onClick) }}
        {{ syncAnchorPressedVisual(active) }}
        <!--
          data-eds-trigger-metrics 与 BatchBarActionItem 同盒（相对 batch glass 绝对定位）；
          视觉 / active 由底栏真「通过 / 签名」按钮承担。
        -->
        <span
          data-eds-trigger-metrics
          :class="[styles.autoTrigger, active && styles.autoTriggerActive]"
          :style="triggerStyle"
          tabindex="-1"
          aria-hidden="true"
          @click="onClick"
        />
      </template>
    </EgConfirmPopover>
  </div>
</template>
