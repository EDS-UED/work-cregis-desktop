<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import ManageOrderManagementPlanTransition from './ManageOrderManagementPlanTransition.vue';
import type { OrderManagementRow } from '../orderManagementTypes';
import styles from './ManageOrderManagementTypePlan.module.css';

const props = defineProps<{
  row: OrderManagementRow;
}>();

const { ui } = useAppI18n();

const primary = computed(() => ui(props.row.operationTypeKey));
</script>

<template>
  <div :class="styles.host">
    <EgListFieldOverflowText
      :text="primary"
      variant="primary"
    />
    <ManageOrderManagementPlanTransition
      :plan-from="row.planFrom"
      :plan-to="row.planTo"
    />
  </div>
</template>
