import { onBeforeUnmount, onMounted, ref } from 'vue';
import { hasOpenClickAnchoredTooltip } from '@eds/desktop-components';
import { isShellDebugUiElement } from './shellDebugUiScope';

const PREVIEW_ACTIVE_FLOAT_SELECTOR =
  '.app-preview [id^="eds-tooltip-v-"] .glassMicroFloatHostActive';

function hasBusinessAnchoredFloatLayerInPreview(): boolean {
  if (hasOpenClickAnchoredTooltip()) {
    return true;
  }

  const preview = document.querySelector('.app-preview');
  if (!preview) {
    return false;
  }

  for (const active of preview.querySelectorAll(PREVIEW_ACTIVE_FLOAT_SELECTOR)) {
    const host = active.closest('[id^="eds-tooltip-v-"]');
    if (host instanceof HTMLElement && !isShellDebugUiElement(host)) {
      return true;
    }
  }

  return false;
}

/**
 * Dev 外层 hover 提示须随业务 click 浮层（批处理 Flotation、Remark Popover 等）同步关闭/禁用。
 * hasOpenClickAnchoredTooltip() 非响应式，须观察 DOM + 计数函数。
 */
export function useBusinessAnchoredLayerBlocksDevIdleHint() {
  const blocked = ref(hasBusinessAnchoredFloatLayerInPreview());
  let rafId = 0;
  let observer: MutationObserver | undefined;

  const sync = () => {
    blocked.value = hasBusinessAnchoredFloatLayerInPreview();
  };

  const scheduleSync = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(sync);
  };

  onMounted(() => {
    sync();
    observer = new MutationObserver(scheduleSync);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'data-eds-tooltip-open', 'aria-expanded'],
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
    cancelAnimationFrame(rafId);
  });

  return blocked;
}
