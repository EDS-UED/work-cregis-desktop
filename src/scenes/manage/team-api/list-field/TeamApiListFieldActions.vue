<script setup lang="ts">
import { inject } from 'vue';
import {
  EgButton,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { teamApiFlowKey } from '../teamApiFlowContext';
import styles from './TeamApiListFieldActions.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();
const flow = inject(teamApiFlowKey);

function onEdit() {
  flow?.openEdit(props.row);
}

function onViewKey(close: () => void) {
  close();
  flow?.requestViewKey(props.row);
}

function onDelete(close: () => void) {
  close();
  flow?.requestDelete(props.row);
}
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgFlotation
      placement="bottom"
      align="end"
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
            box-type="symbol-text"
            :label="ui('View API Key')"
            symbol-icon="eds-key"
            :show-tag="false"
            @click="onViewKey(close)"
          />
          <EgFlotationMenuItem
            box-type="symbol-text"
            :label="ui('Delete')"
            :show-tag="false"
            danger
            @click="onDelete(close)"
          >
            <template #leading>
              <EgIcon name="eds-recycle" size="sm" fit :class="styles.deleteIcon" />
            </template>
          </EgFlotationMenuItem>
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <EgButton variant="solid" tone="decor" size="md" @click="onEdit">
      {{ ui('Edit') }}
    </EgButton>
  </div>
</template>
