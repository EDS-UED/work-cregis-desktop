<script setup lang="ts">
import {
  EgButton,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './WaasListFieldSubAddressActions.module.css';
import {
  WAAS_SUB_ADDRESS_MORE_MENU_PRIMARY,
  WAAS_SUB_ADDRESS_MORE_MENU_SECONDARY,
} from './waasSubAddressMoreMenuItems';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgFlotation
      placement="bottom"
      align="center"
      flip
      boundary-selector=".eds-data-list"
      width-mode="adaptive"
      height-mode="adaptive"
      :show-add="false"
      :show-menu-divider="false"
      close-on-scroll
    >
      <template #trigger="{ expanded }">
        <EgButton variant="text" tone="subtle" size="md" :active="expanded" :aria-expanded="expanded">
          {{ ui('More') }}
        </EgButton>
      </template>
      <template #content="{ close }">
        <EgFlotationMenu
          panel-radius="radius-md"
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
          :show-add="false"
          :show-divider="false"
        >
          <EgFlotationMenuItem
            v-for="action in WAAS_SUB_ADDRESS_MORE_MENU_PRIMARY"
            :key="action.key"
            box-type="symbol-text"
            :label="ui(action.labelKey)"
            :symbol-icon="action.symbolIcon"
            :show-cascader="action.showCascader"
            :show-tag="false"
            @click="close()"
          />
          <div :class="styles.menuDivider">
            <EgDivider type="page" direction="horizontal" />
          </div>
          <EgFlotationMenuItem
            v-for="action in WAAS_SUB_ADDRESS_MORE_MENU_SECONDARY"
            :key="action.key"
            box-type="symbol-text"
            :label="ui(action.labelKey)"
            :symbol-icon="action.symbolIcon"
            :show-tag="false"
            @click="close()"
          />
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <EgButton variant="solid" size="md" tone="decor">
      {{ ui('Send') }}
    </EgButton>
  </div>
</template>
