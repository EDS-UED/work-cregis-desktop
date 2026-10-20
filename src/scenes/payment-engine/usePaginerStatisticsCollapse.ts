import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

function readSpacingPx(name: string, fallback: number) {
  const parsed = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
  );
  return Number.isFinite(parsed) ? parsed : fallback;
}

type StatisticsItem = {
  text: string;
  number: string;
};

/**
 * Collapse EgPaginer statistics into eds-more-ios when the footer cannot
 * fit the expanded totals (Figma 3259:27247).
 */
export function usePaginerStatisticsCollapse(
  hostRef: Ref<HTMLElement | null>,
  measureRef: Ref<HTMLElement | null>,
  items: Ref<readonly StatisticsItem[]>,
) {
  const statisticsCollapse = ref(false);
  let resizeObserver: ResizeObserver | undefined;

  function syncCollapse() {
    if (items.value.length <= 0) {
      statisticsCollapse.value = false;
      return;
    }

    const host = hostRef.value;
    const measure = measureRef.value;
    const paginer = host?.querySelector('.eds-paginer');
    const raw = paginer?.querySelector('.eds-frosted-page-chrome');
    const nextPage = raw?.firstElementChild;
    if (
      !(raw instanceof HTMLElement) ||
      !(nextPage instanceof HTMLElement) ||
      !(measure instanceof HTMLElement)
    ) {
      return;
    }

    const startPad = readSpacingPx('--spacing-4', 16);
    const endPad = readSpacingPx('--spacing-6', 24);
    const clusterGap = readSpacingPx('--spacing-4', 16);
    const available = raw.clientWidth - startPad - endPad;
    const needed =
      nextPage.getBoundingClientRect().width + clusterGap + measure.scrollWidth;
    statisticsCollapse.value = needed >= available;
  }

  function observe() {
    resizeObserver?.disconnect();
    const host = hostRef.value;
    if (!host || typeof ResizeObserver === 'undefined') return;
    resizeObserver = new ResizeObserver(() => {
      void nextTick(syncCollapse);
    });
    resizeObserver.observe(host);
    const preview = document.querySelector('.app-preview');
    if (preview instanceof HTMLElement) {
      resizeObserver.observe(preview);
    }
  }

  onMounted(() => {
    observe();
    void nextTick(syncCollapse);
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = undefined;
  });

  watch(
    () => items.value.map((item) => `${item.text}\0${item.number}`).join('\n'),
    () => {
      void nextTick(syncCollapse);
    },
  );

  return { statisticsCollapse };
}
