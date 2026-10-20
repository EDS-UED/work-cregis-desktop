import { nextTick, onBeforeUnmount, ref, type Ref } from 'vue';

export const MOTION_LAYOUT_DEFORM_CONTENT = 'motion-layout-deform-content' as const;
export const MOTION_LAYOUT_DEFORM_CONTENT_EXITING = 'is-exiting' as const;
export const MOTION_LAYOUT_DEFORM_CONTENT_ENTERING = 'is-entering' as const;

/** 变矮（如 A→B）· 仅作方向标记（shell 高度推断）；内容位移见 glue CSS */
export const MOTION_LAYOUT_DEFORM_TO_SMALLER = 'motion-layout-deform-to-smaller' as const;
/** 变高（如 B→A）· 仅作方向标记（shell 高度推断）；内容位移见 glue CSS */
export const MOTION_LAYOUT_DEFORM_TO_LARGER = 'motion-layout-deform-to-larger' as const;

export type MotionLayoutDeformDirection =
  | typeof MOTION_LAYOUT_DEFORM_TO_SMALLER
  | typeof MOTION_LAYOUT_DEFORM_TO_LARGER;

/** 与 `--motion-delay-layout-deform-content-swap` 一致 · 内容淡出中途换页 */
export const MOTION_LAYOUT_DEFORM_CONTENT_SWAP_MS = 120;

export type MotionLayoutDeformPageSpec = {
  shellHeight: number;
};

function resolveDirection<T extends string>(
  pages: Record<T, MotionLayoutDeformPageSpec>,
  from: T,
  to: T,
): MotionLayoutDeformDirection {
  const fromHeight = pages[from].shellHeight;
  const toHeight = pages[to].shellHeight;
  return toHeight < fromHeight
    ? MOTION_LAYOUT_DEFORM_TO_SMALLER
    : MOTION_LAYOUT_DEFORM_TO_LARGER;
}

export function useMotionLayoutDeformPageSwitch<T extends string>(
  pages: Record<T, MotionLayoutDeformPageSpec>,
  initial: T,
  swapMs: number = MOTION_LAYOUT_DEFORM_CONTENT_SWAP_MS,
): {
  activePage: Ref<T>;
  shellHeight: Ref<number>;
  contentExiting: Ref<boolean>;
  contentEntering: Ref<boolean>;
  contentDirection: Ref<MotionLayoutDeformDirection | null>;
  switchTo: (next: T) => void;
  toggleBetween: (left: T, right: T) => void;
  whenIdle: () => Promise<void>;
} {
  const activePage = ref(initial) as Ref<T>;
  const shellHeight = ref(pages[initial].shellHeight);
  const contentExiting = ref(false);
  const contentEntering = ref(false);
  const contentDirection = ref<MotionLayoutDeformDirection | null>(null);

  let swapTimer: ReturnType<typeof setTimeout> | undefined;
  let enterFrame = 0;
  let idleResolvers: Array<() => void> = [];

  function clearSwapTimer() {
    if (swapTimer !== undefined) {
      clearTimeout(swapTimer);
      swapTimer = undefined;
    }
  }

  function clearEnterFrame() {
    if (enterFrame) {
      cancelAnimationFrame(enterFrame);
      enterFrame = 0;
    }
  }

  function notifyIdle() {
    if (contentExiting.value || contentEntering.value) {
      return;
    }
    const pending = idleResolvers;
    idleResolvers = [];
    pending.forEach((resolve) => resolve());
  }

  function whenIdle(): Promise<void> {
    if (!contentExiting.value && !contentEntering.value) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      idleResolvers.push(resolve);
    });
  }

  function switchTo(next: T) {
    if (next === activePage.value && !contentExiting.value && !contentEntering.value) {
      notifyIdle();
      return;
    }

    clearSwapTimer();
    clearEnterFrame();

    const direction = resolveDirection(pages, activePage.value, next);
    contentDirection.value = direction;
    shellHeight.value = pages[next].shellHeight;
    contentEntering.value = false;
    contentExiting.value = true;

    swapTimer = setTimeout(() => {
      activePage.value = next;
      contentExiting.value = false;
      contentEntering.value = true;

      // Vue patch → paint entering offset → next frame animate to 0 (HTML demo rAF)
      void nextTick(() => {
        enterFrame = requestAnimationFrame(() => {
          contentEntering.value = false;
          enterFrame = 0;
          notifyIdle();
        });
      });

      swapTimer = undefined;
    }, swapMs);
  }

  function toggleBetween(left: T, right: T) {
    switchTo(activePage.value === left ? right : left);
  }

  onBeforeUnmount(() => {
    clearSwapTimer();
    clearEnterFrame();
    idleResolvers = [];
  });

  return {
    activePage,
    shellHeight,
    contentExiting,
    contentEntering,
    contentDirection,
    switchTo,
    toggleBetween,
    whenIdle,
  };
}
