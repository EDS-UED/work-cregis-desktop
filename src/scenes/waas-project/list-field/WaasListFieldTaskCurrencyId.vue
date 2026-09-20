<script setup lang="ts">
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import styles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';

defineProps<{
  customize: Record<string, unknown>;
  collectionId: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.host">
    <TasksListFieldCurrency :customize="customize" />
    <EgListFieldOverflowText :text="collectionId" variant="secondary" tabular />
  </div>
</template>
