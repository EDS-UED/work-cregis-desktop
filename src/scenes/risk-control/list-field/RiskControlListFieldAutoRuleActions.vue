<script setup lang="ts">
import {
  EgButton,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlListFieldAutoRuleActions.module.css';

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
        <EgButton
          variant="text"
          tone="subtle"
          size="md"
          :active="expanded"
          :aria-expanded="expanded"
        >
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
            box-type="symbol-text"
            :label="ui('Logs')"
            symbol-icon="eds-text-logs"
            :show-tag="false"
            @click="close()"
          />
          <EgFlotationMenuItem
            box-type="symbol-text"
            :label="ui('Delete')"
            :show-tag="false"
            danger
            @click="close()"
          >
            <template #leading>
              <EgIcon name="eds-recycle" size="sm" fit :class="styles.deleteIcon" />
            </template>
          </EgFlotationMenuItem>
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <EgButton variant="solid" size="md" tone="decor">
      {{ ui('Edit') }}
    </EgButton>
  </div>
</template>
