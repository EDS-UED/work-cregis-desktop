<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { formatWebhookPushPayloadPretty } from './formatWebhookPushPayloadJson';
import WebhookJsonCodeSnippet from './WebhookJsonCodeSnippet.vue';
import styles from './WebhookPushRequestContentAppend.module.css';

const props = defineProps<{
  payloadJson: string;
}>();

const { ui } = useAppI18n();

const prettyPayload = computed(() => formatWebhookPushPayloadPretty(props.payloadJson));
</script>

<template>
  <div :class="detailChromeStyles.appendSection">
    <EgDivider type="page" direction="horizontal" :class="detailChromeStyles.sectionDivider" />
    <div :class="detailChromeStyles.sectionContent">
      <div :class="detailChromeStyles.sectionTitleRow">
        <span :class="styles.sectionTitle">{{ ui('Webhook push request content') }}</span>
      </div>
      <WebhookJsonCodeSnippet :code="prettyPayload" />
    </div>
  </div>
</template>
