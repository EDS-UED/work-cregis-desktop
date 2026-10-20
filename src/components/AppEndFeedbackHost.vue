<script setup lang="ts">
import { computed } from 'vue';
import { EgEndFeedbackCard } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useAppEndFeedbackState } from '@/composables/appEndFeedback';
import styles from './AppEndFeedbackHost.module.css';

const { ui } = useAppI18n();
const { visible, feedbackKey, messageKey } = useAppEndFeedbackState();

const displayText = computed(() => ui(messageKey.value));
</script>

<template>
  <Teleport to=".app-preview">
    <div v-if="visible" :class="styles.host" data-app-end-feedback-host>
      <EgEndFeedbackCard
        :key="feedbackKey"
        :text="displayText"
      />
    </div>
  </Teleport>
</template>
