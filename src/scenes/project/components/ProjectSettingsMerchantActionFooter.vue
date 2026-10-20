<script setup lang="ts">
import { EgButton, EgDivider } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ProjectSettingsMerchantPanel.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.actionFooter">
    <div :class="styles.actionDividerWrap">
      <EgDivider type="module" direction="horizontal" hide />
    </div>
    <div :class="styles.actionBar">
      <EgButton tone="decor" variant="solid" size="md" type="button">
        {{ ui('Edit') }}
      </EgButton>
    </div>
  </div>
</template>
