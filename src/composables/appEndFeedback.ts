import { ref } from 'vue';

/** 业务操作成功 · EgEndFeedbackCard 展示时长（与 Tasks 列表一致）。 */
const APP_END_FEEDBACK_VISIBLE_MS = 2500;

const visible = ref(false);
const feedbackKey = ref(0);
/** i18n catalog key；展示文案由 AppEndFeedbackHost 内 `ui()` 解析。 */
const messageKey = ref('Success');

let hideTimer: ReturnType<typeof setTimeout> | undefined;

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

export function useAppEndFeedbackState() {
  return {
    visible,
    feedbackKey,
    messageKey,
  };
}
