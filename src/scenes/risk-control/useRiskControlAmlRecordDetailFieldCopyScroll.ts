import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue';

/** 与 EgDetail `scrollFadeTop`（2px）解耦，避免慢滚时在阈值附近反复触发动画。 */
const FIELD_COPY_COLLAPSE_SCROLL_TOP = 16;
const FIELD_COPY_EXPAND_SCROLL_TOP = 4;

function findEgDetailScrollHost(start: HTMLElement): HTMLElement | null {
  const detail = start.closest('.eds-detail');
  if (!detail) return null;

  for (const child of detail.children) {
    if (!(child instanceof HTMLElement)) continue;
    const { overflowY } = getComputedStyle(child);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return child;
    }
  }

  return null;
}

export function useRiskControlAmlRecordDetailFieldCopyScroll(
  hostRef: Ref<HTMLElement | null>,
) {
  const fieldCopyCollapsed = ref(false);
  let scrollHost: HTMLElement | null = null;

  function applyScrollTop(scrollTop: number) {
    if (fieldCopyCollapsed.value) {
      if (scrollTop <= FIELD_COPY_EXPAND_SCROLL_TOP) {
        fieldCopyCollapsed.value = false;
      }
      return;
    }
    if (scrollTop >= FIELD_COPY_COLLAPSE_SCROLL_TOP) {
      fieldCopyCollapsed.value = true;
    }
  }

  function onScroll() {
    if (!scrollHost) return;
    applyScrollTop(scrollHost.scrollTop);
  }

  function unbindScrollHost() {
    if (!scrollHost) return;
    scrollHost.removeEventListener('scroll', onScroll);
    scrollHost = null;
  }

  function bindScrollHost() {
    unbindScrollHost();
    const host = hostRef.value;
    if (!host) return;

    scrollHost = findEgDetailScrollHost(host);
    if (!scrollHost) return;

    applyScrollTop(scrollHost.scrollTop);
    scrollHost.addEventListener('scroll', onScroll, { passive: true });
  }

  onMounted(() => {
    void nextTick(bindScrollHost);
  });

  onBeforeUnmount(unbindScrollHost);

  watch(hostRef, () => {
    void nextTick(bindScrollHost);
  });

  return { fieldCopyCollapsed };
}
