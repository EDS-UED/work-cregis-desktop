<script setup lang="ts">
import { EgButton, EgLinkButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './WaasListFieldRuleActions.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.host">
    <EgLinkButton tone="brand" size="sm" href="#">
      {{ ui('More') }}
    </EgLinkButton>
    <EgButton tone="decor" variant="solid" size="sm">
      {{ ui('Start') }}
    </EgButton>
  </div>
</template>
