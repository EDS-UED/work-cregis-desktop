<script setup lang="ts">
import { EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { CUSTOMER_SERVICE_APP_VERSION } from './customerService.constants';
import styles from './CustomerServicePanel.module.css';

const emit = defineEmits<{
  close: [];
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div class="eds-customer-service-panel" :class="styles.root">
    <div :class="styles.hero">
      <div :class="styles.topBar">
        <div :class="styles.brand">
          <span :class="styles.brandMark">
            <EgIcon name="eds-cregis" fit />
          </span>
          <span :class="styles.brandWord">CREGIS</span>
        </div>
        <div :class="styles.windowControls">
          <button
            type="button"
            :class="[styles.windowDot, styles.windowDotAction]"
            :aria-label="ui('Close')"
            @click="emit('close')"
          >
            <span :class="styles.windowDotGlyph">
              <EgIcon name="eds-close-mini" fit />
            </span>
          </button>
          <span :class="styles.windowDot" aria-hidden="true" />
          <span :class="styles.windowDot" aria-hidden="true" />
        </div>
      </div>

      <p :class="styles.greeting">
        <span>{{ ui('Hello!') }}</span>
        <span>{{ ui('You can ask any question, or share your suggestions.') }}</span>
      </p>

      <button type="button" :class="styles.cta">
        <span :class="styles.ctaCopy">
          <span :class="styles.ctaTitle">
            {{ ui('Customer service is busy. Tap to leave a message.') }}
          </span>
          <span :class="styles.ctaSubtitle">
            {{ ui('You can use self-service, or leave us a message.') }}
          </span>
        </span>
        <span :class="styles.ctaArrow" aria-hidden="true">
          <EgIcon name="eds-arrow-right" fit />
        </span>
      </button>
    </div>

    <div :class="styles.body">
      <p :class="styles.version">{{ CUSTOMER_SERVICE_APP_VERSION }}</p>
    </div>
  </div>
</template>
