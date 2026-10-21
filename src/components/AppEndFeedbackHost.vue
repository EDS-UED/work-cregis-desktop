<script setup lang="ts">
import { computed } from 'vue';
import { EgEndFeedbackCard } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useAppEndFeedbackState } from '@/composables/appEndFeedback';
import styles from './AppEndFeedbackHost.module.css';

const { ui } = useAppI18n();
const { visible, feedbackKey, messageKey } = useAppEndFeedbackState();

/** catalog key → 展示文案；与 showcase 一致，组件仅 `text` prop。 */
const displayText = computed(() => ui(messageKey.value));
</script>

<template>
  <!-- 与 AppPopupOverlayHost 同级挂 eds-tooltip-panel 内；禁 Teleport（易丢层叠/定位）。 -->
  <div
    v-show="visible"
    class="desktopTokens app-end-feedback-host"
    :class="styles.host"
    data-app-end-feedback-host
  >
    <EgEndFeedbackCard v-if="visible" :key="feedbackKey" :text="displayText" />
  </div>
</template>
