import { useMotionLayoutContentSwitch } from '@eds/desktop-components';
import { computed, nextTick, ref, watch, type Ref } from 'vue';

/**
 * Tab 切换时下属内容的 crossfade（EDS `useMotionLayoutContentSwitch` + `EgMotionLayoutContent`）。
 *
 * - `reset`：Tab 栏在滚动区外、内容区自滚；切换即回滚动区顶部。
 * - `sticky-anchor`：Tab 栏在整页滚动内 sticky；切换期间锁内容区高度（防交换瞬间塌高被浏览器钳到页顶），
 *   且 Tab 栏已吸顶时把滚动对齐到内容区顶部。
 */
export type TabContentMotionScroll =
  | { mode: 'none' }
  | { mode: 'reset'; scrollRef: Ref<HTMLElement | null> }
  | {
    mode: 'sticky-anchor';
    /** Tab 栏 + 内容区的共同容器；其顶边 = Tab 栏未吸顶时的位置。 */
    anchorRef: Ref<HTMLElement | null>;
    /** 包住 `EgMotionLayoutContent` 的内容区，切换期间锁 min-height。 */
    bodyRef: Ref<HTMLElement | null>;
  };

function findScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

function alignScrollToAnchorIfStuck(anchor: HTMLElement) {
  const host = findScrollParent(anchor);
  if (!host) return;
  const stickyBar = anchor.firstElementChild;
  const stickyBarStyle = stickyBar ? getComputedStyle(stickyBar) : null;
  const stickyTop = stickyBarStyle?.position === 'sticky'
    ? Number.parseFloat(stickyBarStyle.top || '0') || 0
    : 0;
  const stickLine = host.getBoundingClientRect().top
    + Number.parseFloat(getComputedStyle(host).paddingTop || '0')
    + stickyTop;
  const anchorTop = anchor.getBoundingClientRect().top;
  if (anchorTop >= stickLine) return;
  host.scrollTop += anchorTop - stickLine;
}

export function useTabContentMotionSwitch(
  activeTab: Ref<number>,
  scroll: TabContentMotionScroll = { mode: 'none' },
) {
  const displayedTabIndex = ref(activeTab.value);
  const bodyMinHeight = ref<number | null>(null);

  const {
    contentExiting,
    contentEntering,
    switchContent,
    whenIdle,
  } = useMotionLayoutContentSwitch();

  watch(activeTab, (next, prev) => {
    if (next === prev) return;

    if (scroll.mode === 'reset') {
      scroll.scrollRef.value?.scrollTo({ top: 0, behavior: 'instant' });
    } else if (scroll.mode === 'sticky-anchor') {
      const body = scroll.bodyRef.value;
      if (body) bodyMinHeight.value = body.offsetHeight;
      const anchor = scroll.anchorRef.value;
      if (anchor) alignScrollToAnchorIfStuck(anchor);
    }

    switchContent(() => {
      displayedTabIndex.value = next;
    });

    if (scroll.mode === 'sticky-anchor') {
      void whenIdle().then(async () => {
        await nextTick();
        bodyMinHeight.value = null;
      });
    }
  }, { flush: 'sync' });

  /** 外部重置（换详情 id、换 preset）时无动画同步。 */
  function syncDisplayedTab() {
    displayedTabIndex.value = activeTab.value;
  }

  const bodyStyle = computed(() =>
    bodyMinHeight.value != null ? { minHeight: `${bodyMinHeight.value}px` } : undefined,
  );

  return {
    displayedTabIndex,
    contentExiting,
    contentEntering,
    bodyStyle,
    syncDisplayedTab,
  };
}
