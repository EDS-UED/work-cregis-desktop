<script setup lang="ts">
import { watch } from 'vue';
import {
  MOTION_PAGE_CONTENT,
  useMotionPageTransition,
  type MotionPageDirection,
} from '@eds/desktop-components';
import styles from './layoutChromePageStack.shared.module.css';

const props = defineProps<{
  /** 为 false 时直通 slot，不参与 motion-page。 */
  enabled: boolean;
  pageKey: string;
}>();

const emit = defineEmits<{
  'page-settled': [];
}>();

function resolveLayoutChromePageStackDirection(
  from: string,
  to: string,
): MotionPageDirection {
  if (from === 'list' && (to === 'detail' || to === 'create')) {
    return 'forward';
  }
  if ((from === 'detail' || from === 'create') && to === 'list') {
    return 'backward';
  }
  return 'none';
}

const {
  direction,
  isAnimating,
  transitionHandlers,
  setDirection: setMotionDirection,
} = useMotionPageTransition('none');

function setDirection(next: MotionPageDirection) {
  setMotionDirection(next);
}

/** pageKey 与 data-page-direction 须同 tick 更新，Transition 才走 motion-page 曲线。 */
watch(
  () => props.pageKey,
  (next, previous) => {
    if (!props.enabled || previous === undefined || next === previous) {
      return;
    }
    setMotionDirection(resolveLayoutChromePageStackDirection(previous, next));
  },
  { flush: 'sync' },
);

function settleMotionPage() {
  if (!isAnimating.value) {
    setMotionDirection('none');
    emit('page-settled');
  }
}

function onAfterEnter() {
  transitionHandlers.onAfterEnter();
  settleMotionPage();
}

function onAfterLeave() {
  transitionHandlers.onAfterLeave();
  settleMotionPage();
}

defineExpose({
  setDirection,
});
</script>

<template>
  <div
    v-if="enabled"
    class="motion-page-stack"
    :class="[styles.pageStack, isAnimating && 'is-animating']"
    :data-page-direction="direction"
  >
    <Transition
      name="motion-page"
      @before-enter="transitionHandlers.onBeforeEnter"
      @before-leave="transitionHandlers.onBeforeLeave"
      @after-enter="onAfterEnter"
      @after-leave="onAfterLeave"
    >
      <div :key="pageKey" class="motion-page">
        <div :class="[MOTION_PAGE_CONTENT, styles.pageContent]">
          <!-- v-if 须在 keyed motion-page 内，避免父级 slot 先切内容吃掉 Pop leave。 -->
          <!-- 详情 ToolBar 在 slot 内 EgLayout overlay；toolbar 行结构与 create 一致以共用 motion-page。 -->
          <div v-if="props.pageKey === 'detail'" :class="styles.pageChrome">
            <div :class="styles.pageChromeToolbar">
              <slot name="detail-toolbar" />
            </div>
            <div :class="styles.pageChromeBody">
              <slot name="detail" />
            </div>
          </div>
          <div v-else-if="props.pageKey === 'create'" :class="styles.pageChrome">
            <div :class="styles.pageChromeToolbar">
              <slot name="create-toolbar" />
            </div>
            <div :class="styles.pageChromeBody">
              <slot name="create" />
            </div>
            <div :class="styles.pageChromePaginer">
              <slot name="create-footer" />
            </div>
          </div>
          <div v-else :class="styles.pageChrome">
            <div :class="styles.pageChromeToolbar">
              <slot name="list-toolbar" />
            </div>
            <div :class="styles.pageChromeBody">
              <slot name="list" />
            </div>
            <div :class="styles.pageChromePaginer">
              <slot name="list-paginer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <slot v-else />
</template>
