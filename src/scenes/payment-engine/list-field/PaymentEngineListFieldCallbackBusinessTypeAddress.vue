<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldHashLikeLine, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';

const props = defineProps<{
  businessTypeKey: string;
  callbackUrl: string;
}>();

const { ui } = useAppI18n();

const businessTypeLabel = computed(() => ui(props.businessTypeKey));
const callbackAddress = computed(() => props.callbackUrl?.trim() ?? '');
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <EgListFieldOverflowText
        :text="businessTypeLabel"
        variant="primary"
      />
      <EgListFieldHashLikeLine
        :text="callbackAddress"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
