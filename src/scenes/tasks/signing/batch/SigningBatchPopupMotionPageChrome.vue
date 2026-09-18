<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import { MOTION_PAGE_CONTENT } from '@eds/desktop-components';
import chromeScrimStyles from '@eds/desktop-components/styles/popupChromeScrim.module.css';
import styles from './batchSigning.shared.module.css';

const SCROLL_EDGE_EPSILON = 2;

const props = withDefaults(
  defineProps<{
    /** 摘要等正文区自滚；子页 DataList 自滚时为 false。 */
    bodyScroll?: boolean;
    /** 正文滚离顶部且下方仍有内容时，底栏开 scrim（摘要 ToolBar）。 */
    footerScrim?: boolean;
    scrollFadeTopEnabled?: boolean;
  }>(),
  {
    bodyScroll: false,
    footerScrim: false,
    scrollFadeTopEnabled: true,
  },
);

const bodyRef = ref<HTMLElement | null>(null);
const scrollOverflows = ref(false);
const scrollFadeTop = ref(false);

let scrollResizeObserver: ResizeObserver | undefined;

const footerScrimActive = computed(
  () => props.footerScrim && scrollFadeTop.value && scrollOverflows.value,
);

function updateScrollState() {
  const element = bodyRef.value;

  if (!element || !props.bodyScroll) {
    scrollOverflows.value = false;
    scrollFadeTop.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  const hasHiddenContentBelow =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;

  scrollOverflows.value = hasHiddenContentBelow;
  scrollFadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function observeScrollTargets() {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = new ResizeObserver(() => {
    updateScrollState();
  });

  if (bodyRef.value) {
    scrollResizeObserver.observe(bodyRef.value);
  }

  updateScrollState();
}

function scheduleScrollUpdate() {
  void nextTick(observeScrollTargets);
}

onMounted(scheduleScrollUpdate);
onUpdated(scheduleScrollUpdate);

watch(bodyRef, scheduleScrollUpdate);
watch(
  () => props.bodyScroll,
  scheduleScrollUpdate,
);

onBeforeUnmount(() => {
  scrollResizeObserver?.disconnect();
});

function onBodyScroll() {
  updateScrollState();
}

function scrollToTop() {
  bodyRef.value?.scrollTo({ top: 0, behavior: 'instant' });
}

defineExpose({
  scrollToTop,
});
</script>

<template>
  <div :class="[MOTION_PAGE_CONTENT, styles.batchPopupMotionPageChrome]">
    <div
      ref="bodyRef"
      :class="[
        styles.batchPopupMotionPageBody,
        bodyScroll && styles.batchPopupMotionPageBodyScroll,
        scrollFadeTopEnabled && bodyScroll && scrollFadeTop && styles.batchPopupMotionPageBodyScrollFadeTop,
      ]"
      @scroll="onBodyScroll"
    >
      <slot />
    </div>
    <footer
      v-if="$slots.footer"
      :class="[
        styles.batchPopupMotionPageFooter,
        chromeScrimStyles.root,
        footerScrimActive && chromeScrimStyles.active,
      ]"
    >
      <div :class="chromeScrimStyles.content">
        <slot name="footer" />
      </div>
    </footer>
  </div>
</template>
