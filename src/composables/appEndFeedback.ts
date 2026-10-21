import { nextTick, ref } from 'vue';

/** 业务操作成功 · EgEndFeedbackCard 展示时长（与 Tasks 列表一致）。 */
const APP_END_FEEDBACK_VISIBLE_MS = 2500;

/** overlay 内 EgPopup 卸净后再展示；超时兜底，避免永久不显示。 */
const APP_END_FEEDBACK_AFTER_OVERLAY_MAX_WAIT_MS = 480;

const visible = ref(false);
const feedbackKey = ref(0);
/** i18n catalog key；展示文案由 AppEndFeedbackHost 内 `ui()` 解析。 */
const messageKey = ref('Success');

let hideTimer: ReturnType<typeof setTimeout> | undefined;

function countOpenOverlayPopups(): number {
  if (typeof document === 'undefined') return 0;
  return document.querySelectorAll(
    '.app-preview .app-popup-overlay-host .eds-popup',
  ).length;
}

/** 全局业务操作成功反馈（EgEndFeedbackCard · 成功）。 */
export function showAppEndFeedback(catalogMessageKey = 'Success') {
  messageKey.value = catalogMessageKey;
  feedbackKey.value += 1;
  visible.value = true;

  if (hideTimer !== undefined) {
    clearTimeout(hideTimer);
  }
  hideTimer = window.setTimeout(() => {
    visible.value = false;
    hideTimer = undefined;
  }, APP_END_FEEDBACK_VISIBLE_MS);
}

/** Verify / Dialog 关闭后再展示，避免被 EgPopup scrim 挡住或 z-index 抢叠。 */
export function showAppEndFeedbackAfterOverlay(catalogMessageKey = 'Success') {
  const started = performance.now();

  function tryShow() {
    const elapsed = performance.now() - started;
    if (
      countOpenOverlayPopups() === 0
      || elapsed >= APP_END_FEEDBACK_AFTER_OVERLAY_MAX_WAIT_MS
    ) {
      showAppEndFeedback(catalogMessageKey);
      return;
    }
    requestAnimationFrame(tryShow);
  }

  void nextTick().then(() => {
    requestAnimationFrame(tryShow);
  });
}

export function useAppEndFeedbackState() {
  return {
    visible,
    feedbackKey,
    messageKey,
  };
}
