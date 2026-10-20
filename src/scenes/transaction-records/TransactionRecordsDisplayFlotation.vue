<script setup lang="ts">
import {
  EgFlotation,
  EgFlotationMenu,
  EgIcon,
  EgIconProButton,
  EgSwitch,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './TransactionRecordsDisplayFlotation.module.css';

const hideSmallTransactions = defineModel<boolean>('hideSmallTransactions', {
  default: false,
});

const { ui } = useAppI18n();
</script>

<template>
  <span :class="styles.root">
    <EgFlotation
      placement="bottom"
      align="end"
      :show-add="false"
      :show-menu-divider="false"
      boundary-selector=".app-preview"
      flip
      close-on-scroll
    >
      <template #trigger="{ expanded }">
        <EgIconProButton
          :label="ui('Display')"
          :active="expanded"
          :aria-expanded="expanded"
        >
          <EgIcon name="eds-list-editor" size="sm" />
        </EgIconProButton>
      </template>

      <template #content>
        <EgFlotationMenu
          :class="[styles.menu, 'desktopTokens']"
          data-no-corner-smoothing
          panel-radius="radius-md"
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
          :show-add="false"
          :show-divider="false"
        >
          <div :class="styles.row">
            <EgSwitch
              v-model="hideSmallTransactions"
              size="sm"
            />
            <span :class="styles.label">{{ ui('Hide small transactions') }}</span>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </span>
</template>
