<script setup lang="ts">
import { computed } from 'vue';
import { EgStatusTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from '@/scenes/tasks/list-field/TasksListFieldStatus.module.css';
import type { OrderManagementRow } from '../orderManagementTypes';
import {
  resolveOrderManagementStatusLabelKey,
  resolveOrderManagementStatusTagStatus,
} from '../orderManagementStatusLabels';

const props = defineProps<{
  row: OrderManagementRow;
}>();

const { ui } = useAppI18n();

const tagLabel = computed(() =>
  ui(resolveOrderManagementStatusLabelKey(props.row.statusKey)),
);

const tagStatus = computed(() => resolveOrderManagementStatusTagStatus(props.row.statusKey));
</script>

<template>
  <div :class="styles.statusPreview">
    <EgStatusTag :status="tagStatus" size="lg">
      {{ tagLabel }}
    </EgStatusTag>
  </div>
</template>
