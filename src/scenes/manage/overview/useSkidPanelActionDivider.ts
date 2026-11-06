import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref, type Ref } from 'vue';

const SCROLL_EDGE_EPSILON = 2;

function findSkidScrollBody(scrollRegion: HTMLElement): HTMLElement | null {
  const header = scrollRegion.querySelector('header');
  const sibling = header?.nextElementSibling;
  return sibling instanceof HTMLElement ? sibling : null;
}

/** 对齐 EgSkid · actionDividerVisible：下方无可滚内容时不显示底栏分割线。 */
export function useSkidPanelActionDivider(rootRef: Ref<HTMLElement | null>) {
  const actionDividerVisible = ref(false);

  let scrollRegion: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | undefined;
  const observedElements = new Set<Element>();

  function updateActionDividerVisible() {
    if (!scrollRegion) {
      actionDividerVisible.value = false;
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = scrollRegion;
    const bodyCanScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
    actionDividerVisible.value =
      bodyCanScroll
      && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
  }

  function scheduleActionDividerCheck() {
    nextTick(() => {
      requestAnimationFrame(updateActionDividerVisible);
    });
  }

  function observeElement(element: Element) {
    if (!resizeObserver || observedElements.has(element)) {
      return;
    }
    resizeObserver.observe(element);
    observedElements.add(element);
  }

  function bindScrollRegion() {
    if (scrollRegion) {
      return;
    }

    scrollRegion = rootRef.value?.closest(
      '.eds-scroll-area-hidden-scrollbar',
    ) as HTMLElement | null;

    if (!scrollRegion) {
      return;
    }

    scrollRegion.addEventListener('scroll', updateActionDividerVisible, {
      passive: true,
    });

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        scheduleActionDividerCheck();
      });
    }

    observeElement(scrollRegion);
    const bodyEl = findSkidScrollBody(scrollRegion);
    if (bodyEl) {
      observeElement(bodyEl);
    }

    scheduleActionDividerCheck();
  }

  function unbindScrollRegion() {
    scrollRegion?.removeEventListener('scroll', updateActionDividerVisible);
    resizeObserver?.disconnect();
    resizeObserver = undefined;
    observedElements.clear();
    scrollRegion = null;
  }

  onMounted(() => {
    bindScrollRegion();
  });

  onUpdated(() => {
    bindScrollRegion();
    if (scrollRegion) {
      const bodyEl = findSkidScrollBody(scrollRegion);
      if (bodyEl) {
        observeElement(bodyEl);
      }
    }
    scheduleActionDividerCheck();
  });

  onBeforeUnmount(() => {
    unbindScrollRegion();
  });

  return {
    actionDividerVisible,
    scheduleActionDividerCheck,
  };
}
