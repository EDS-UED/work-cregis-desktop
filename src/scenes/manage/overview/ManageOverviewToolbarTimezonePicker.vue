<script setup lang="ts">
import { EgFlotation, EgIcon, EgIconProButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  OVERVIEW_TIMEZONE_FLOTATION_MAX_HEIGHT,
  OVERVIEW_TIMEZONE_FLOTATION_WIDTH,
} from './manageOverviewTimezone.constants';
import ManageOverviewToolbarTimezoneFlotationMenu from './ManageOverviewToolbarTimezoneFlotationMenu.vue';
import styles from './ManageOverviewToolbarTimezonePicker.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <EgFlotation
    :class="styles.root"
    placement="bottom"
    align="end"
    width-mode="fixed"
    :width="OVERVIEW_TIMEZONE_FLOTATION_WIDTH"
    height-mode="adaptive"
    :max-height="OVERVIEW_TIMEZONE_FLOTATION_MAX_HEIGHT"
    :show-add="false"
    :show-menu-divider="false"
    boundary-selector=".app-preview"
    flip
    close-on-scroll
  >
    <template #trigger="{ expanded }">
      <EgIconProButton
        :label="ui('Overview Timezone Settings')"
        :active="expanded"
        :aria-expanded="expanded"
      >
        <EgIcon name="eds-clocks-set" size="sm" />
      </EgIconProButton>
    </template>
    <template #content>
      <ManageOverviewToolbarTimezoneFlotationMenu />
    </template>
  </EgFlotation>
</template>
