<script setup lang="ts">
import { EgLinkButton, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './PaymentEngineListFieldCallbackUrl.module.css';

const props = defineProps<{
  url: string;
  showActions?: boolean;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText :text="url" variant="primary" tabular />
    <div v-if="showActions" :class="styles.actions">
      <EgLinkButton tone="brand" size="sm" href="#">
        {{ ui('Ignore') }}
      </EgLinkButton>
      <EgLinkButton tone="brand" size="sm" href="#">
        {{ ui('Retry') }}
      </EgLinkButton>
    </div>
  </div>
</template>
