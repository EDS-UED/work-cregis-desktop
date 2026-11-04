<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { EMPTY_DISPLAY } from '@/utils/formatEmptyDisplay';
import type { OrderManagementRow } from '../orderManagementTypes';
import styles from './ManageOrderManagementActions.module.css';

defineProps<{
  row: OrderManagementRow;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <template v-if="row.statusKey === 'Pending Payment'">
      <EgButton variant="text" tone="subtle" size="md">
        {{ ui('Cancel') }}
      </EgButton>
      <EgButton variant="solid" tone="decor" size="md">
        {{ ui('Order Management Pay') }}
      </EgButton>
    </template>
    <span
      v-else
      :class="['typography-body-medium', styles.emptyDisplay]"
    >
      {{ EMPTY_DISPLAY }}
    </span>
  </div>
</template>
