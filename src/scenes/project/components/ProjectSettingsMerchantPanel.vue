<script setup lang="ts">
import { useAppI18n } from '@/composables/useAppI18n';
import ProjectSettingsItem from '@/scenes/project/components/ProjectSettingsItem.vue';
import { MERCHANT_SETTINGS_DEMO } from '@/scenes/project/components/projectSettingsMerchantDemo';
import styles from './ProjectSettingsMerchantPanel.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.panel">
    <ProjectSettingsItem
      :label="ui('Merchant Name')"
      :value="MERCHANT_SETTINGS_DEMO.name"
      :show-chevron="false"
      :reserve-actions-space="true"
    />

    <div :class="styles.logoItemShell">
      <div :class="styles.logoRow">
        <div :class="styles.logoBox">
          <span :class="styles.logoLabel">{{ ui('Merchant Logo') }}</span>
          <span :class="styles.logoMark" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
</template>
