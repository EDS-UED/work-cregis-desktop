<script setup lang="ts">
import { computed } from 'vue';
import { EgStatusTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from '@/scenes/tasks/list-field/TasksListFieldStatus.module.css';
import type { FeeRecordRow } from '../feeRecordTypes';
import {
  resolveFeeRecordRowStatusKey,
  resolveFeeRecordStatusLabelKey,
  resolveFeeRecordStatusTagStatus,
} from '../feeRecordStatusLabels';

const props = defineProps<{
  row: FeeRecordRow;
}>();

const { ui } = useAppI18n();

const statusKey = computed(() => resolveFeeRecordRowStatusKey(props.row));

const tagLabel = computed(() => ui(resolveFeeRecordStatusLabelKey(statusKey.value)));

const tagStatus = computed(() => resolveFeeRecordStatusTagStatus(statusKey.value));
</script>

<template>
  <div class="list-field-status" :class="styles.statusPreview">
    <EgStatusTag :status="tagStatus" size="lg">
      {{ tagLabel }}
    </EgStatusTag>
  </div>
</template>
