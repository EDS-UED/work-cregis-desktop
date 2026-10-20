<script setup lang="ts">
import { EgListFieldHashLikeLine } from '@eds/desktop-components';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';

defineProps<{
  url: string;
  datetime: string;
  alignEnd?: boolean;
}>();
</script>

<template>
  <div
    class="desktopTokens list-field-general-structure"
    :class="[styles.host, alignEnd && styles.hostAlignEnd]"
  >
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <EgListFieldHashLikeLine
        :text="url"
        variant="primary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
      <EgListFieldHashLikeLine
        :text="datetime"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
