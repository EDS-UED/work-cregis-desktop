<script setup lang="ts">
import { EgListFieldOverflowText, EgTag } from '@eds/desktop-components';
import styles from './PaymentEngineListField.shared.module.css';

const props = withDefaults(
  defineProps<{
    primary: string;
    secondary?: string;
    /** 地址前的别名 pill（如 Mr. Wang）。 */
    receiverTag?: string;
    alignEnd?: boolean;
  }>(),
  {
    secondary: '',
  },
);
</script>

<template>
  <div :class="[styles.host, props.alignEnd && styles.hostAlignEnd]">
    <div v-if="props.receiverTag?.trim()" :class="styles.receiverLeadRow">
      <EgTag family="system" system-type="solid-brand" size="sm">
        {{ props.receiverTag.trim() }}
      </EgTag>
    </div>
    <EgListFieldOverflowText :text="props.primary" variant="primary" tabular />
    <EgListFieldOverflowText
      v-if="props.secondary?.trim()"
      :text="props.secondary"
      variant="secondary"
      tabular
    />
  </div>
</template>
